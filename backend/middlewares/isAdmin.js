import User from "../models/userModel.js";

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        
        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }
        
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Admin authorization error" });
    }
};

export default isAdmin;