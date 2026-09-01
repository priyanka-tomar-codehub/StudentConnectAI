import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
    {
        mentor:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true   
        },
        date: {
            type: Date,
            required: true,
        },

        startTime: {
            type: String,
            required: true,
        },

        endTime: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ["available", "booked", "completed", "cancelled"],
            default: "available",
        },
    },
    {
        timestamps: true,
    }
    
);
export default mongoose.model("Slot", slotSchema);