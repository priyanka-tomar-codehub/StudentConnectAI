import User from "../models/User.js";
import Booking from "../models/Booking.js";

// Admin Dashboard Statistics
export const getAdminDashboard = async (req, res) => {
    try {
        const [
            totalStudents,
            totalAlumni,
            totalBookings,
            pendingVerifications,
            verifiedAlumni
        ] = await Promise.all([
            User.countDocuments({ role: "student" }),

            User.countDocuments({ role: "alumni" }),

            Booking.countDocuments(),

            User.countDocuments({
                role: "alumni",
                isVerified: false
            }),

            User.countDocuments({
                role: "alumni",
                isVerified: true
            })
        ]);

        return res.status(200).json({
            success: true,
            message: "Admin dashboard data fetched successfully",
            data: {
                totalStudents,
                totalAlumni,
                totalBookings,
                pendingVerifications,
                verifiedAlumni
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all students
export const getAllStudents = async (req, res) => {
    try {
        const { search } = req.query;

        let filter = {
            role: "student"
        };

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        const students = await User.find(filter)
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Students fetched successfully",
            data: students
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Block or Unblock student
export const toggleStudentBlock = async (req, res) => {
    try {
        const student = await User.findOne({
            _id: req.params.id,
            role: "student"
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        student.isBlocked = !student.isBlocked;

        await student.save();

        return res.status(200).json({
            success: true,
            message: student.isBlocked
                ? "Student blocked successfully"
                : "Student unblocked successfully",
            data: {
                isBlocked: student.isBlocked
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};