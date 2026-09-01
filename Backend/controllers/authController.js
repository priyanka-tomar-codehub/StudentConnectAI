import User from "../models/User.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
    try {

        // STEP 1: Receive data from frontend
        const {
            name,
            email,
            password,
            role,
            college,
            branch,
            currentYear,
            graduationYear,
            company,
            designation
        } = req.body;

        // STEP 2: Validate common fields
        if (!name || !email || !password || !role || !college) {
            return res.status(400).json(
                new ApiResponse(400, "Please fill all required fields.")
            );
        }

        // STEP 3: Student validation
        if (role === "student") {
            if (!branch || !currentYear || !graduationYear) {
                return res.status(400).json(
                    new ApiResponse(400, "Student details are required.")
                );
            }
        }

        // STEP 4: Alumni validation
        if (role === "alumni") {
            if (!company || !designation) {
                return res.status(400).json(
                    new ApiResponse(400, "Alumni details are required.")
                );
            }
        }

        // STEP 5: Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json(
                new ApiResponse(409, "User already exists.")
            );
        }
        const hashedPassword = await bcrypt.hash(password, 10);

          const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            college,
            branch,
            currentYear,
            graduationYear,
            company,
            designation
        });

         return res.status(201).json(
            new ApiResponse(201, "User Registered Successfully", user)
        );

        // return res.status(200).json(
        // new ApiResponse(
        // 200,
        // "Password Hashed Successfully",
        // {
        //     hashedPassword
        // }
        // )
        // );
    
        // return res.status(200).json(
        //     new ApiResponse(200, "Validation Successful")
        // );

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
       return res.status(400).json(
        new ApiResponse(
            400,
            "Please provide email and password."
        )
      );
     }
     const user = await User.findOne({ email });

     if (!user) {
     return res.status(404).json(
        new ApiResponse(
            404,
            "User not found."
        )
     );
}
    const isPasswordMatch = await bcrypt.compare(
    password,
    user.password
);

if (!isPasswordMatch) {
    return res.status(401).json(
        new ApiResponse(
            401,
            "Invalid credentials."
        )
    );
}

const token = generateToken(user._id);

return res.status(200).json(
    new ApiResponse(
        200,
        "Login Successful",
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        }
    )
);
        // return res.status(200).json(
        //     new ApiResponse(
        //         200,
        //         "Login API Working",
        //         {
        //             email,
        //             password
        //         }
        //     )
        // );

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};
export const getProfile = async (req, res) => {

    return res.status(200).json(
        new ApiResponse(
            200,
            "Profile fetched successfully",
            req.user
        )
    );

};