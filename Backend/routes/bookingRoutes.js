import express from "express";
import protect from "../middleware/authMiddleware.js";
import { bookslot } from "../controllers/bookingController.js";
import { getMyBookings } from "../controllers/bookingController.js";
import {getMentorBookings} from "../controllers/bookingController.js";
import { cancelBooking } from "../controllers/bookingController.js";

const router = express.Router();

router.post('/', protect, bookslot);
router.get("/my-bookings", protect, getMyBookings);
router.get("/mentor-bookings", protect, getMentorBookings);
router.patch("/cancel/:id", protect, cancelBooking);

export default router;