import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken.js';

export const adminLogin = async (req, res, next) => {
    const { email, password, role } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields required" });
    }

        // Directly access the 'admins' collection
        const adminExist = await mongoose.connection.collection('admins').findOne({ email, role: 'admin' });
        console.log(adminExist)

        if (!adminExist) {
            return res.status(404).json({ success: false, message: "Admin does not exist" });
        }

        const passwordMatch = bcrypt.compareSync(password, adminExist.password);

        if (!passwordMatch) {
            return res.status(400).json({ success: false, message: "Admin not authenticated" });
        }

        const token = generateToken(email, role);

        res.cookie("token", token);

        res.json({ success: true, message: "Admin login successful" });
}





export const checkAdmin = async (req, res, next) => {
    
        const admin = req.admin;

        if (!admin) {
            return res.status(400).json({ success: true, message: "Admin not authenticated" });
        }
        res.json({ success: true, message: "Admin authenticated" });

};