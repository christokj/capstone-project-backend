import nodemailer from 'nodemailer';

// Simple in-memory store for OTPs
// const otpStore = {};

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_ADMIN,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Generate OTP 
export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

// Send OTP via email
// export const sendOTP = async (email, otp) => {
//     await transporter.sendMail({
//         from: process.env.EMAIL_ADMIN,
//         to: email,
//         subject: 'Your OTP Code for Profile Update',
//         text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,  
//     });
// }

export async function sendOTP({ from, to, subject, emailHtml, attachments = [] }) {
    const options = {
        from,
        to,
        subject,
        html: emailHtml,
        attachments
    };

    const info = await transporter.sendMail(options);
    return info;
}


// Save OTP to in-memory store
export const getOTP = async (email) => {

    const otp = generateOTP();

    if (!process.env.EMAIL_ADMIN && !process.env.EMAIL_PASS && email) {

        console.warn('No Gmail credentials provided. OTP will not be sent.');
        return null 
    }

   await sendOTP({
        from: process.env.EMAIL_ADMIN,
        to: email,
        subject: 'Your OTP Code for Profile Update',
        emailHtml: `<p>Your OTP code is ${otp}. It will expire in 5 minutes.</p>`
    });

    return otp;
}
