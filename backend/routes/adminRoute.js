import express from "express";
import isAuth from "../middlewares/isAuth.js";
import isAdmin from "../middlewares/isAdmin.js";
import {
    getDashboardStats,
    getAllUsers,
    updateUserRole,
    toggleUserStatus,
    deleteUser,
    getAllCoursesAdmin,
    deleteCourseAdmin,
    getAllReviewsAdmin,
    deleteReviewAdmin,
    getAllOrders,
    getSuperAdminInfo
} from "../controllers/adminController.js";

const adminRouter = express.Router();

// All admin routes require authentication and admin role
adminRouter.use(isAuth, isAdmin);

// Dashboard
adminRouter.get("/dashboard-stats", getDashboardStats);

// User management
adminRouter.get("/users", getAllUsers);
adminRouter.put("/users/:userId/role", updateUserRole);
adminRouter.put("/users/:userId/toggle-status", toggleUserStatus);
adminRouter.delete("/users/:userId", deleteUser);

// Course management
adminRouter.get("/courses", getAllCoursesAdmin);
adminRouter.delete("/courses/:courseId", deleteCourseAdmin);

// Review management
adminRouter.get("/reviews", getAllReviewsAdmin);
adminRouter.delete("/reviews/:reviewId", deleteReviewAdmin);

// Order management
adminRouter.get("/orders", getAllOrders);

adminRouter.get("/super-admin-info", getSuperAdminInfo);


export default adminRouter;