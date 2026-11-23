import jwt from "jsonwebtoken";
import User from "../models/User.js";

const socketAuth = async (socket, next) => {
  try {
    // Step 1: Get token from frontend
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    // Step 2: Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 3: Find user in database
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new Error("User not found"));
    }

    // Step 4: Check blocked account
    if (user.isBlocked) {
      return next(new Error("Your account has been blocked"));
    }

    // Step 5: Allow only students and alumni
    if (!["student", "alumni"].includes(user.role)) {
      return next(new Error("Only students and alumni can access chat"));
    }

    // Step 6: Attach user information to socket
    socket.user = user;

    // Step 7: Allow connection
    next();

  } catch (error) {
    return next(new Error("Invalid or expired token"));
  }
};

export default socketAuth;