import express from "express";
import protect, { adminOnly } from "../middleware/authMiddleware.js";
import {
    getAdminDashboard,
    getAllStudents,
    toggleStudentBlock,
    getAllAlumni,
    toggleAlumniBlock
} from "../controllers/adminController.js";



const router = express.Router();


router.get("/dashboard", protect, adminOnly, getAdminDashboard);
router.get("/students", protect, adminOnly, getAllStudents);

router.patch("/students/:id/block", protect, adminOnly, toggleStudentBlock);

router.get("/alumni", protect, adminOnly, getAllAlumni);

router.patch(
    "/alumni/:id/block",
    protect,
    adminOnly,
    toggleAlumniBlock
);
export default router;