import Booking from "../models/Booking.js";
import Slot from "../models/Slot.js";
import ApiResponse from "../utils/ApiResponse.js";

export const bookslot = async (req, res) => {
    try {
        const { slotId } = req.body;
        const slot = await Slot.findById(slotId);

        if (!slot) {
            return res.status(404).json(
                new ApiResponse(
                    404,
                    "Slot not found",
                    "The specified slot does not exist."
                )
            );
        }

        if (slot.status !== "available") {
          return res.status(400).json(
             new ApiResponse(
             400,
             "Slot not available",
             "This slot has already been booked or is no longer available."
             )
          );
       }
            const studentId = req.user._id;

            const booking = await Booking.create({
                mentor: slot.mentor,
                student: studentId,
                slot: slotId
            });
       
        slot.status = "booked";
        await slot.save();

        return res.status(201).json(
            new ApiResponse(
                201,
                "Slot booked successfully",
                booking
            )
        );
    }
    catch (error) {
        
        return res.status(500).json(
            new ApiResponse(
                500,
               "Internal Server Error",
                 error.message)
                );
    }
}
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      student: req.user._id
    })
      .populate("mentor", "name email")
      .populate("slot");

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMentorBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      mentor: req.user._id
    })
      .populate("student", "name email")
      .populate("slot");

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (booking.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to complete this booking"
      });
    }

    if (booking.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Only confirmed bookings can be completed"
      });
    }

    booking.status = "completed";
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking completed successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);

    if (booking.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to cancel this booking"
      });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled"
      });
    }

    booking.status = "cancelled";
    await booking.save();

    const slot = await Slot.findById(booking.slot);

    if (slot) {
      slot.status = "available";
      await slot.save();
    }

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully"
    });

    


  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

