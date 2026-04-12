import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
import Lecture from "../models/lectureModel.js";
import Review from "../models/reviewModel.js";
import Order from "../models/orderModel.js";

// ================== HELPER FUNCTION FOR MONTHLY STATS ==================
const getMonthlyStats = async (period) => {
    const monthlyStats = [];
    const now = new Date();
    let monthsToShow = 6; // Show last 6 months by default
    
    if (period === 'week') monthsToShow = 1;
    if (period === 'month') monthsToShow = 3;
    if (period === 'year') monthsToShow = 12;
    
    for (let i = monthsToShow - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(now.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthOrders = await Order.find({
            isPaid: true,
            paidAt: { $gte: monthStart, $lte: monthEnd }
        });
        
        const monthRevenue = monthOrders.reduce((sum, order) => sum + (order.amount / 100), 0);
        const monthOrdersCount = monthOrders.length;
        
        monthlyStats.push({
            name: date.toLocaleString('default', { month: 'short' }),
            revenue: monthRevenue,
            orders: monthOrdersCount
        });
    }
    
    return monthlyStats;
};

// In getDashboardStats function, fix the revenue calculation:
export const getDashboardStats = async (req, res) => {
    try {
        const { period } = req.query;
        let dateFilter = {};
        const now = new Date();
        
        // Apply date filter based on period
        if (period === 'week') {
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - 7);
            dateFilter = { createdAt: { $gte: startOfWeek } };
        } else if (period === 'month') {
            const startOfMonth = new Date(now);
            startOfMonth.setMonth(now.getMonth() - 1);
            dateFilter = { createdAt: { $gte: startOfMonth } };
        } else if (period === 'year') {
            const startOfYear = new Date(now);
            startOfYear.setFullYear(now.getFullYear() - 1);
            dateFilter = { createdAt: { $gte: startOfYear } };
        }
        
        // Apply filters to each collection
        const totalUsers = await User.countDocuments(dateFilter);
        const totalStudents = await User.countDocuments({ ...dateFilter, role: "student" });
        const totalEducators = await User.countDocuments({ ...dateFilter, role: "educator" });
        const totalCourses = await Course.countDocuments(dateFilter);
        const publishedCourses = await Course.countDocuments({ ...dateFilter, isPublished: true });
        const totalLectures = await Lecture.countDocuments(dateFilter);
        const totalReviews = await Review.countDocuments(dateFilter);
        
        // Count orders with date filter
        const totalOrders = await Order.countDocuments({ ...dateFilter, isPaid: true });
        
        // Calculate revenue correctly
        const orders = await Order.find({ ...dateFilter, isPaid: true });
        const totalRevenue = orders.reduce((sum, order) => sum + (order.amount / 100), 0);
        
        // Recent users
        const recentUsers = await User.find(dateFilter)
            .sort({ createdAt: -1 })
            .limit(5)
            .select("name email role createdAt");
        
        // Recent courses
        const recentCourses = await Course.find(dateFilter)
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("creator", "name");
        
        // Monthly data for charts
        const monthlyData = await getMonthlyStats(period);
        
        return res.status(200).json({
            totalUsers,
            totalStudents,
            totalEducators,
            totalCourses,
            publishedCourses,
            totalLectures,
            totalReviews,
            totalOrders,
            totalRevenue,
            recentUsers,
            recentCourses,
            monthlyData
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Failed to get stats: ${error}` });
    }
};

// ================== GET ALL USERS (EXCLUDE SUPER ADMIN) ==================
export const getAllUsers = async (req, res) => {
    try {
        const { role, search, page = 1, limit = 10 } = req.query;
        
        let query = {};
        
        // EXCLUDE SUPER ADMIN (admin@gmail.com)
        query.email = { $ne: "admin@gmail.com" };
        
        if (role && role !== "all") {
            query.role = role;
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const users = await User.find(query)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await User.countDocuments(query);
        
        return res.status(200).json({
            users,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit))
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Failed to get users: ${error}` });
    }
};

// ================== UPDATE USER ROLE (Super Admin Only) ==================
export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        const currentAdminId = req.userId;
        
        // Check if current user is SUPER ADMIN
        const currentAdmin = await User.findById(currentAdminId);
        if (!currentAdmin || currentAdmin.email !== "admin@gmail.com") {
            return res.status(403).json({ 
                message: "Only Super Admin can change user roles" 
            });
        }
        
        // Prevent changing Super Admin's own role
        const targetUser = await User.findById(userId);
        if (targetUser.email === "admin@gmail.com") {
            return res.status(403).json({ 
                message: "Cannot modify Super Admin role" 
            });
        }
        
        if (!["student", "educator", "admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }
        
        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        ).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        return res.status(200).json({ 
            message: `User role updated to ${role} successfully`, 
            user 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Failed to update role: ${error}` });
    }
};

// ================== TOGGLE USER STATUS ==================
export const toggleUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentAdminId = req.userId;
        
        const currentAdmin = await User.findById(currentAdminId);
        const isSuperAdmin = currentAdmin && currentAdmin.email === "admin@gmail.com";
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Prevent toggling Super Admin status
        if (user.email === "admin@gmail.com") {
            return res.status(403).json({ message: "Cannot modify Super Admin status" });
        }
        
        // Only Super Admin can deactivate other admins
        if (user.role === "admin" && !isSuperAdmin) {
            return res.status(403).json({ 
                message: "Only Super Admin can deactivate other admins" 
            });
        }
        
        user.isActive = !user.isActive;
        await user.save();
        
        return res.status(200).json({
            message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
            isActive: user.isActive
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Failed to toggle status: ${error}` });
    }
};


// ================== DELETE USER ==================
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentAdminId = req.userId;
        
        const currentAdmin = await User.findById(currentAdminId);
        const isSuperAdmin = currentAdmin && currentAdmin.email === "admin@gmail.com";
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Prevent deleting Super Admin
        if (user.email === "admin@gmail.com") {
            return res.status(403).json({ message: "Cannot delete Super Admin" });
        }
        
        // Only Super Admin can delete other admins
        if (user.role === "admin" && !isSuperAdmin) {
            return res.status(403).json({ 
                message: "Only Super Admin can delete other admins" 
            });
        }
        
        if (user.role === "educator") {
            await Course.deleteMany({ creator: userId });
        }
        
        await Review.deleteMany({ user: userId });
        
        await Course.updateMany(
            { enrolledStudents: userId },
            { $pull: { enrolledStudents: userId } }
        );
        
        await user.deleteOne();
        
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Failed to delete user: ${error}` });
    }
};


// ================== GET SUPER ADMIN INFO ==================
export const getSuperAdminInfo = async (req, res) => {
    try {
        const currentAdminId = req.userId;
        const currentAdmin = await User.findById(currentAdminId).select("-password");
        
        const isSuperAdmin = currentAdmin && currentAdmin.email === "admin@gmail.com";
        
        return res.status(200).json({
            isSuperAdmin,
            admin: currentAdmin
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to get admin info" });
    }
};

// ================== GET ALL COURSES (ADMIN) ==================
export const getAllCoursesAdmin = async (req, res) => {
    try {
        const { search, isPublished, page = 1, limit = 10 } = req.query;
        
        let query = {};
        if (search) {
            query.title = { $regex: search, $options: "i" };
        }
        if (isPublished !== undefined && isPublished !== "") {
            query.isPublished = isPublished === "true";
        }
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const courses = await Course.find(query)
            .populate("creator", "name email")
            .populate("lectures")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await Course.countDocuments(query);
        
        return res.status(200).json({
            courses,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit))
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Failed to get courses: ${error}` });
    }
};

// ================== DELETE COURSE (ADMIN) ==================
export const deleteCourseAdmin = async (req, res) => {
    try {
        const { courseId } = req.params;
        
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        
        await Lecture.deleteMany({ _id: { $in: course.lectures } });
        await Review.deleteMany({ course: courseId });
        await User.updateMany(
            { enrolledCourses: courseId },
            { $pull: { enrolledCourses: courseId } }
        );
        await course.deleteOne();
        
        return res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Failed to delete course: ${error}` });
    }
};

// ================== GET ALL REVIEWS (ADMIN) ==================
export const getAllReviewsAdmin = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const reviews = await Review.find()
            .populate("user", "name email photoUrl")
            .populate("course", "title")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await Review.countDocuments();
        
        return res.status(200).json({
            reviews,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit))
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Failed to get reviews: ${error}` });
    }
};

// ================== DELETE REVIEW (ADMIN) ==================
export const deleteReviewAdmin = async (req, res) => {
    try {
        const { reviewId } = req.params;
        
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        
        await Course.updateOne(
            { _id: review.course },
            { $pull: { reviews: reviewId } }
        );
        
        await review.deleteOne();
        
        return res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Failed to delete review: ${error}` });
    }
};

// ================== GET ALL ORDERS ==================
export const getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const orders = await Order.find()
            .populate("course", "title price")
            .populate("student", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await Order.countDocuments();
        
        // Calculate total revenue correctly
        const totalRevenueResult = await Order.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        
        // Convert from paise to rupees
        const totalRevenue = (totalRevenueResult[0]?.total || 0) / 100;
        
        return res.status(200).json({
            orders,
            total,
            totalRevenue: totalRevenue,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit))
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Failed to get orders: ${error}` });
    }
};