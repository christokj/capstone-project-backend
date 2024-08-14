import { User } from "../models/userModel.js";
import { generateUserToken } from "../utils/generateToken.js";
import validateUserData from "../validations/signUpJoi.js";
import bcrypt from 'bcrypt';

export const userCreate = async ( req, res, next) => {
    const data = req.body

    const validatedData = await validateUserData(data);

    console.log(validatedData)
   
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
    const token = generateUserToken(email);

    res.cookie("token", token);
    res.json({ success: true, message: "user created successfully" });

}