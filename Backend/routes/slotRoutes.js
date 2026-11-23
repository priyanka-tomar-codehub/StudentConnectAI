import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createSlot } from "../controllers/slotController.js";
import { getAvailableSlots } from "../controllers/slotController.js";
import { getMySlots } from "../controllers/slotController.js";
import { deleteSlot } from "../controllers/slotController.js";  
import {getMentorAvailableSlots} from "../controllers/slotController.js";
const router = express.Router();

router.post("/", protect, createSlot);
router.get("/available", getAvailableSlots);
router.get("/my-slots", protect, getMySlots);
router.delete("/:id",protect, deleteSlot);
router.get("/mentor/:mentorId", protect, getMentorAvailableSlots);

export default router;