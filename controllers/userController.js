import { User } from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";
import { getOTP, verifyOTP } from "../utils/otpService.js";
import validateUserData from "../validations/signUpJoi.js";
import bcrypt from 'bcrypt';

export const userCreate = async ( req, res, next ) => {
    const data = req.body

    const validatedData = await validateUserData(data);
   
    const { fullname, email, password, mobile, address } = validatedData.value;

    if (!fullname || !email || !password || !mobile || !address) {
        return res.status(400).json({ success: false, message: "All fields required" });
    }

    const userExist = await User.findOne({ email });
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

export const userLogin = async ( req, res, next ) => {

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

export const userLogout = async ( req, res, next ) => {
   
    res.clearCookie("token");

        res.json({ success: true, message: "User logout successfully" });
   
};

export const userProfile = async ( req, res, next ) => {
   
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

export const updateUserProfile = async (req, res, next) => {
      const userTypedOtp = req.body

      console.log(otp+"otp from the middleware")

     const data = verifyOTP( email, otp );

     if (data) {
        
     }
        
};