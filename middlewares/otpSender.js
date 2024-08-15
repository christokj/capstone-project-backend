import { getOTP, verifyOTP } from "../utils/otpService";

export const otpSender = async ( req, res, next ) => {

    const { id } = req.params;
    
    // Fetch user data
    const userData = await User.findById(id);
    
    if (!userData) {
        return res.status(400).json({ success: false, message: 'User not found' });
    }
    
    const { email, password, address, mobile, fullname } = userData;
    
    // Generating OTP
    const otp = getOTP(email);

     res.status(200).json({ success: true, message: 'OTP sent to your email. Please verify to update your profile.' });

     
   next(otp);
}