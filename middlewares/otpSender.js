
import { getOTP } from "../utils/otpService.js";

export const otpSender = async (req, res, next) => {

    const {email}  = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email id not found' });
    }

    // Generating OTP
    const otp = getOTP(email);
    req.session.email = email
    req.session.otp = otp; // saving otp in the express-session
    
    next();
}