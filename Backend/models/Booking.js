import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema( 
    {
        mentor:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true   
                },
        student:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
        status: {
            type: String,
            enum: ["confirmed", "completed", "cancelled"],
            default: "confirmed",
        },
        slot:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Slot",
            required: true
            
        }
    },
    {timestamps: true}
);
export default mongoose.model("Booking", bookingSchema);