import nodemailer from 'nodemailer';

// Simple in-memory store for OTPs
const otpStore = {};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
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
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code for Profile Update',
        text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    });
}

// Save OTP to in-memory store
export function getOTP(email) {
    const otp = generateOTP();
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // 5 minutes expiration

    sendOTP(email, otp);

    return otp;
}

// Verify OTP
export function verifyOTP(email, otp) {
    const storedOtp = otpStore[email];

    if (!storedOtp) {
        throw new Error('OTP not found. Please request a new one.');
    }

    const { otp: validOtp, expiresAt } = storedOtp;

    if (Date.now() > expiresAt) {
        delete otpStore[email]; // Clear expired OTP
        throw new Error('OTP has expired. Please request a new one.');
    }

    if (otp !== validOtp) {
        throw new Error('Invalid OTP.');
    }

    // Clear OTP after successful verification
    delete otpStore[email];

    return true;
}
