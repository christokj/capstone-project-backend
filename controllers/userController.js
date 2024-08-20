import mongoose from "mongoose";
import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";
import { passHashing } from "../utils/passwordHashing.js";
import validateUserData from "../validations/signUpJoi.js";
import bcrypt from 'bcrypt';


export const userCreate = async (req, res, next) => {
    const data = req.body

    const validatedData = await validateUserData(data);

    const { fullname, email, password, mobile, address } = validatedData.value;

    if (!fullname || !email || !password || !mobile || !address) {
        return res.status(400).json({ success: false, message: "All fields required" });
    }

    const userExist = await User.findOne({ email }).select("-password");
    if (userExist) {
        return res.status(400).json({ success: false, message: "User already exists" });
    }

    //hashing
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = bcrypt.hashSync(password, salt);

    //create new user
    const newUser = new User({ fullname, email, password: hashedPassword, mobile, address });
    await newUser.save();

    //create token
    const token = generateToken(email);

    res.cookie("token", token);
    res.json({ success: true, message: "User created successfully" });

}

export const userLogin = async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields required" });
    }

    const userExist = await User.findOne({ email });

    if (!userExist) {
        return res.status(404).json({ success: false, message: "User does not exist" });
    }

    const passwordMatch = bcrypt.compareSync(password, userExist.password);

    if (!passwordMatch) {
        return res.status(400).json({ success: false, message: "User not authenticated" });
    }

    const token = generateToken(email);

    res.cookie("token", token);

    res.json({ success: true, message: "User login successfully" });
}

export const userLogout = async (req, res, next) => {

    res.clearCookie("token");

    res.json({ success: true, message: "User logout successfully" });

};

export const userProfile = async (req, res, next) => {

    const { id } = req.params;
    const useData = await User.findById(id).select("-password");

    res.json({ success: true, message: "User data fetched", data: useData });

};

export const checkUser = async (req, res, next) => {

    const user = req.user;

    if (!user) {
        return res.status(400).json({ success: true, message: "User not authenticated" });
    }
    res.json({ success: true, message: "User authenticated" });

};

export const otpHandler = async (req, res, next) => {

    const { userTypedOtp } = req.body
    if (!userTypedOtp) {
        return res.status(200).json({ success: true, message: 'OTP sent to your email. Please verify to update your profile.' });
    }

    if (req.session.otp == userTypedOtp) {
        req.session.verified = true;
        return res.json({ success: true, message: "Otp verified, Now you can update your personal details" });
    }
    return res.json({ success: false, message: "Error, Please try again" });
};

export const fetchUserDetails = async (req, res, next) => {

    const { id } = req.params;
    const useData = await User.findById(id).select("-password");
    return res.json({ success: true, message: "User data fetched", data: useData });
}

export const updateUserProfile = async (req, res, next) => {
    // console.log(req.session.verified) //is this working , Add in the if condition  

    if (true) {

        const { id } = req.params;
        const { fullname, email, password, mobile, address } = req.body;

        if (!fullname || !email || !password || !mobile || !address) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        //hashing
        const hashedPassword = await passHashing(password);

        const user = await User.findByIdAndUpdate(id,
            { fullname, email, hashedPassword, mobile, address },
            { new: true, runValidators: true } // It will return the updated document
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        console.log(user)

        return res.json({ success: true, message: 'User updated successfully', user });


    }
}

export const addToCart = async (req, res, next) => {

    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
        return res.status(400).json({ success: false, message: "All fields required" });
    }
  
    const user = await User.findById(userId).select("-password");

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    const cartItem = user.cart.items.find(item => item.productId.toString() === productId);

    if (cartItem) {
        // If the product is already in the cart, update the quantity
        cartItem.quantity += quantity;
    } else {
        // If the product is not in the cart, add it as a new item
        user.cart.items.push({ productId, quantity });
    }

    user.cart.total = user.cart.items.reduce((acc, item) => acc + item.quantity, 0);

    await user.save();

    return res.json({ success: true, message: 'Product added to cart successfully', user });

}

