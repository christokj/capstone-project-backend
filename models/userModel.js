import mongoose from "mongoose";

const Schema = mongoose.Schema;

// The user schema
const userSchema = new Schema(
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
        password: {
            type: String,
            required: [true, "Password is required"],
            minLength: [6, "Password must be at least 6 characters long"],
            maxLength: [100, "Password cannot exceed 100 characters"],
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
        address: {
            street: { type: String, trim: true, required: true},
            city: { type: String, trim: true, required: true },
            state: { type: String, trim: true, required: true },
            zipCode: { type: String, trim: true, required: true },
            country: { type: String, trim: true, required: true },
        },
        cart: {
            items: [{
                productId: { type: Schema.Types.ObjectId, ref: 'Product' },
                quantity: { type: Number, default: 1 },
            }],
            total: {
                type: Number,
                default: 0,
            }
        },
        orderHistory: [{
            orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
            date: { type: Date, default: Date.now },
        }],
        role: {
            type: String,
            enum: ["user", "admin", "moderator"],
            default: "user",
        },
        status: {
            type: String,
            enum: ["active", "inactive", "suspended"],
            default: "active",
        },
        lastLogin: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Index creation for email
userSchema.index({ email: 1 }, { unique: true });

// Virtual property for full name in uppercase
userSchema.virtual("fullnameUpperCase").get(function () {
    return this.fullname.toUpperCase();
});

// Pre-save hook to format mobile number (e.g., adding country code)
userSchema.pre("save", function (next) {
    if (this.isModified("mobile")) {
        this.mobile = `+91${this.mobile}`; // Automatically adding a country code (e.g., +91 for India)
    }
    next();
});

// Method to check if the user is active
userSchema.methods.isActive = function () {
    return this.status === "active";
};

// Method to update last login time
userSchema.methods.updateLastLogin = function () {
    this.lastLogin = Date.now();
    return this.save();
};

// Method to change the user's role
userSchema.methods.changeRole = function (newRole) {
    if (["user", "admin", "moderator"].includes(newRole)) {
        this.role = newRole;
        return this.save();
    } else {
        throw new Error("Invalid role");
    }
};

// Export the user model
export const User = mongoose.model("User", userSchema);
