import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import connectDB from "../config/db.js";

const createAdmin = async () => {
    try {
        // Check environment variables
        const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_COLLEGE } = process.env;

        if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_COLLEGE) {
            throw new Error("Please provide all ADMIN details in .env file");
        }

        // Connect to MongoDB
        await connectDB();

        // Check if admin already exists
        const existingAdmin = await User.findOne({
            email: ADMIN_EMAIL.toLowerCase().trim()
        });

        if (existingAdmin) {
            console.log("Admin account already exists!");
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

        // Create admin
        const admin = await User.create({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL.toLowerCase().trim(),
            password: hashedPassword,
            role: "admin",
            college: ADMIN_COLLEGE,
            isBlocked: false
        });

        console.log("Admin created successfully!");
        console.log("Admin Email:", admin.email);

    } catch (error) {
        console.error("Admin creation failed:", error.message);
    } finally {
        await mongoose.disconnect();
    }
};

createAdmin();