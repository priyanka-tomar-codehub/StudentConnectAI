import express from 'express';
import { getMentors, getMentorById } from '../controllers/mentorController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getMentors);
router.get("/:id", protect, getMentorById);

export default router;
