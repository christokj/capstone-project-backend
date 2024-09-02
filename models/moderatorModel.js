import mongoose from "mongoose";

const moderatorSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: [true, "Full name is required"],
            maxLength: [50, "Full name cannot exceed 50 characters"],
            trim: true,
            validate: {
                validator: function (v) {
                    return /^[a-zA-Z\s]+$/.test(v);
                },
                message: (props) => `${props.value} is not a valid name! Only letters and spaces are allowed.`,
            },
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            minLength: [3, "Email must be at least 3 characters long"],
            maxLength: [50, "Email cannot exceed 50 characters"],
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
        },
        mobile: {
            type: String,
            required: [true, "Mobile number is required"],
            validate: {
                validator: function (v) {
                    return /^\d{10}$/.test(v); // Simple validation for a 10-digit number
                },
                message: (props) => `${props.value} is not a valid mobile number!`,
            },
        },
        status: {
            type: String,
            enum: ["active", "inactive", "suspended"],
            default: "active",
        },
        role: {
            type: String,
            default: "moderator",
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minLength: [8, "Password must be at least 8 characters long"],
            maxLength: [100, "Password cannot exceed 100 characters"],
        },
        shopName: {
            type: String,
            maxLength: [50, "Shop name cannot exceed 50 characters"],
            trim: true,
        }
    },
    { timestamps: true }
);

export const Moderator = mongoose.model("Moderator", moderatorSchema);
