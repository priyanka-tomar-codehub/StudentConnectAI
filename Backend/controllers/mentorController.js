import User from "../models/User.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getMentors = async (req, res) => {

    try {
        const{
            company,
            designation,
            skills,
            search
        } = req.query;

        let filter = {
            role: "alumni",
            isVerified: true
        };''

       if (company) {
        filter.company = company;
       }


        if (designation) {
            filter.designation = designation;
        }

        if (skills) {
            filter.skills = { $in: [skills] };
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { company: { $regex: search, $options: "i" } },
                { designation: { $regex: search, $options: "i" } }
            ];
        }

        const mentors = await User.find(filter)
            .select("-password");

            return res.status(200).json(
            new ApiResponse(
                200, 
                "Mentors fetched successfully",
                 mentors)
        );
    } catch(error) {
        return res.status(500).json({
            success: false,
            message:error.message,
      });
    }   
};