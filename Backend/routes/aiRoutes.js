import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  generateInterview,
  evaluateAnswer,
} from "../controllers/aiController.js";

const router = express.Router();

router.post(
  "/generate-interview",
  protect,
  generateInterview
);

router.post(
  "/evaluate-answer",
  protect,
  evaluateAnswer
);

export default router;