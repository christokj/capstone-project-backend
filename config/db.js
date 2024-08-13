import mongoose from "mongoose";

export const connectDB = () => {
    try {
        // Connecting to database using mongoose and used promise for error handling
        mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Database connected successfully');
        }).catch((err) => {
            console.error('MongoDB connection error:', err);
        });
    } catch (error) {
        console.log(error);
    }
};
