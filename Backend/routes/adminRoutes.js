import express from "express";
import protect, { adminOnly } from "../middleware/authMiddleware.js";
import {
    getAdminDashboard,
    getAllStudents,
    toggleStudentBlock
} from "../controllers/adminController.js";



const router = express.Router();

// Only logged-in admins can access dashboard
router.get("/dashboard", protect, adminOnly, getAdminDashboard);
router.get("/students", protect, adminOnly, getAllStudents);

router.patch("/students/:id/block", protect, adminOnly, toggleStudentBlock);

export default router;