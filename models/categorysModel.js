import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        trim: true,
        required: true,
    },
}, {
    timestamps: true,
});

export const Category = mongoose.model('Category', CategorySchema);


