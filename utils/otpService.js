import nodemailer from 'nodemailer';

// Simple in-memory store for OTPs
// const otpStore = {};

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_ADMIN,
        pass: process.env.EMAIL_PASS,
    },
});

// Generate OTP 
export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

// Send OTP via email
export async function sendOTP(email, otp) {
    await transporter.sendMail({
        from: process.env.EMAIL_ADMIN,
        to: email,
        subject: 'Your OTP Code for Profile Update',
        text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    });
}

// Save OTP to in-memory store
export function getOTP(email) {

    const otp = generateOTP();

    // otpStore[email] = { otp, expiresAt: Date.now() + 3 * 60 * 1000 }; // 3 minutes expiration
 
    sendOTP(email, otp);

    return otp;
}
