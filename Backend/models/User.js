import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ==========================
    // Authentication
    // ==========================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "alumni", "admin"],
      required: true,
    },

    // ==========================
    // Common Profile
    // ==========================

    profileImage: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
    },

    college: {
      type: String,
      required: true,
      trim: true,
    },

    linkedInProfile: {
      type: String,
      default: "",
    },

    githubProfile: {
      type: String,
      default: "",
    },

    skills: [
      {
        type: String,
      },
    ],

    // ==========================
    // Student Fields
    // ==========================

    branch: {
      type: String,
      required: function () {
        return this.role === "student";
      },
    },

    currentYear: {
      type: Number,
      required: function () {
        return this.role === "student";
      },
    },

    graduationYear: {
      type: Number,
      required: function () {
        return this.role === "student";
      },
    },

    enrollmentNumber: {
      type: String,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },

    // ==========================
    // Alumni Fields
    // ==========================

    company: {
      type: String,
      required: function () {
        return this.role === "alumni";
      },
    },

    designation: {
      type: String,
      required: function () {
        return this.role === "alumni";
      },
    },

    experience: {
      type: Number,
      default: 0,
    },

    mentorStatus: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationStatus: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
    },
    
    rating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    // ==========================
    // Account Status
    // ==========================

    isBlocked: {
      type: Boolean,
      default: false,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;