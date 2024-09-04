
import { getOTP } from "../utils/otpService.js";

export const otpSender = async (req, res, next) => {

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email id not found' });
    }

    // Generating OTP
    const otp = getOTP(email);

    if (!otp) {
        return res.status(500).json({ success: false, message: 'Failed to generate OTP' });
    }

    req.session.email = email
    req.session.otp = otp; // saving otp in the express-session

    next();
    
}