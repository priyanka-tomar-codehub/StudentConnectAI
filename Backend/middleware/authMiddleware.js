import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          message: "User not found",
        });
      }

      if (req.user.isBlocked) {
        return res.status(403).json({
          success: false,
          message: "Your account has been blocked",
        });
      }

      return next();
    }

    return res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    });

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// Admin authorization
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. Admin only.",
  });
};

export default protect;