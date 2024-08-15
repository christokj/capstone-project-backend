import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        default: '',
    },
    image: {
        type: String,
        trim: true,
        default: '',
    },
}, {
    timestamps: true,
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
