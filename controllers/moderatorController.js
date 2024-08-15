import bcrypt from "bcrypt";
import { Moderator } from "../models/moderatorModel.js";
import { generateToken } from "../utils/generateToken.js";
import validateModeratorData from "../validations/moderatorJoi.js";


export const moderatorCreate = async (req, res, next) => {
   
        const data = req.body;

        const validatedData = await validateModeratorData(data);

        const { fullname, email, password, mobile } = validatedData.value;

        if (!fullname || !email || !password || !mobile) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        const moderatorExist = await Moderator.findOne({ email, role: 'moderator' });

        if (moderatorExist) {
            return res.status(404).json({ success: false, message: "Moderator already exist" });
        }

        //hashing
        const salt = 10;
        const hashedPassword = bcrypt.hashSync(password, salt);

        //create new user
        const newModerator = new Moderator({ fullname, email, password: hashedPassword, mobile, role: "moderator" });
        await newModerator.save();

        //create token
        const token = generateToken(email, "moderator");

        res.cookie("token", token);
        res.json({ success: true, message: "Moderator created successfully" });
    
};

export const moderatorLogin = async ( req, res, next ) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields required" });
    }

    const moderatorExist = await Moderator.findOne({ email });

    if (!moderatorExist) {
        return res.status(404).json({ success: false, message: "Moderator does not exist" });
    }

    const passwordMatch = bcrypt.compareSync(password, moderatorExist.password);

    if (!passwordMatch) {
        return res.status(400).json({ success: false, message: "Moderator not authenticated" });
    }

    const token = generateToken(email);

    res.cookie("token", token);

    res.json({ success: true, message: "Moderator login successfully" });
}

export const moderatorLogout = async ( req, res, next ) => {
   
    res.clearCookie("token"); // clearing cookies

    res.json({ success: true, message: "Moderator logout successfully" });
   
};

