import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createSlot } from "../controllers/slotController.js";
import { getAvailableSlots } from "../controllers/slotController.js";

const router = express.Router();

router.post("/", protect, createSlot);
router.get("/available", getAvailableSlots);

export default router;