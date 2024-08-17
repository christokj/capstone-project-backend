import { User } from "../models/userModel.js";
import { getOTP } from "../utils/otpService.js";

export const otpSender = async (req, res, next) => {

        const { id } = req.params;

        // Fetch user data
        const userData = await User.findById(id);

        if (!userData) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        const { email } = userData;

        // Generating OTP
        const otp = getOTP(email);

        req.session.otp = otp; // saving otp in the express-session
        //next called in the async handler
}