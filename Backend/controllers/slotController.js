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

export const getMySlots = async (req, res) => {
    try {   
        const slots = await Slot.find({
            mentor: req.user._id
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

 
export const deleteSlot = async (req, res) => {
    try {
        const slot = await Slot.findById(req.params.id);
        if (!slot) {
            return res.status(404).json({
                success: false,
                message: "Slot not found"
            });
        }
        if (slot.mentor.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not the owner of this slot"
            });
        }
        if (slot.status === "booked") {
            return res.status(400).json({
                success: false,
                message: "Booked slot cannot be deleted"
            });
        }


        await Slot.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Slot deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getMentorAvailableSlots = async (req, res) => {
  try {
    const { mentorId } = req.params;

    const slots = await Slot.find({
      mentor: mentorId,
      status: "available",
    }).sort({ date: 1, startTime: 1 });

    return res.status(200).json({
      success: true,
      data: slots,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};