import Slot from "../models/Slot.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createSlot = async (req, res) => {
    try{
        const { date, startTime, endTime } = req.body;

        if (!date || !startTime || !endTime) {
            return res.status(400).json(
                new ApiResponse(400, "All fields are required.",null)
                
            );
        }
        // Only alumni can create slots
        if (req.user.role !== "alumni") {
            return res.status(403).json(
                new ApiResponse(403, "Only alumni can create interview slots.",null)
            );
        }
        // Create Slot
        const slot = await Slot.create({
            mentor: req.user._id,
            date,
            startTime,
            endTime,
        });
         return res.status(201).json(
            new ApiResponse(
                201,
                "Interview slot created successfully.",
                slot
            )
        );

    }
     catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

export const getAvailableSlots = async (req, res) => {
  try {
    const slots = await Slot.find({
      status: "available"
    });

    return res.status(200).json({
      success: true,
      data: slots
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};