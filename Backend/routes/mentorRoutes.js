import express from 'express';
import { getMentors } from '../controllers/mentorController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getMentors);

export default router;
