import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken.js';
import { User } from '../models/userModel.js';
import { Product } from '../models/productModel.js';
import { Moderator } from '../models/moderatorModel.js';
import { Category } from '../models/categoryModel.js';

export const adminLogin = async (req, res, next) => {
    const { email, password, role } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields required" });
    }
    // Directly access the 'admins' collection
    const adminExist = await mongoose.connection.collection('admins').findOne({ email, role });

    if (!adminExist) {
        return res.status(404).json({ success: false, message: "Admin does not exist" });
    }

    const passwordMatch = bcrypt.compareSync(password, adminExist.password);

    if (!passwordMatch) {
        return res.status(400).json({ success: false, message: "Admin not authenticated" });
    }

    const token = generateToken(email, role);

    res.cookie("token", token);

    return res.status(200).json({ success: true, message: "Admin login successful", token });
}


export const checkAdmin = (req, res, next) => {

    const tokenVerified = req.admin;

    if (!tokenVerified) {
        return res.status(400).json({ success: true, message: "Admin not authenticated" });
    }

    return res.status(200).json({ success: true, message: "Admin authenticated" });

};

export const viewUsers = async (req, res, next) => {

    const users = await User.find().select("-password");

    if (!users) {
        return res.status(500).json({ success: false, message: "Failed to fetch users" });
    }

    return res.json({ success: true, users });
}

export const handleUserStaus = async (req, res, next) => {

    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ success: false, message: "User ID required" });
    }

    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    const updatedStatus = user.status === "frozen" ? "active" : "frozen";

    await User.findByIdAndUpdate(id, { status: updatedStatus }, { new: true });

    if (updatedStatus === "active") {

        return res.json({ success: true, message: "User activated successfully" });

    } else if (updatedStatus === "frozen") {

        return res.json({ success: true, message: "User frozen successfully" });

    } else {

        return res.status(500).json({ success: false, message: "Failed to update user status" });

    }
}

export const removeProduct = async (req, res, next) => {

    const { id } = req.params; //Product id
    if (!id) {
        return res.status(400).json({ success: false, message: "Product ID required" });
    }

    const response = await Product.findByIdAndDelete(id); // Find by id and removing product

    if (!response) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, message: "Product removed successfully" });
}

export const handleModeratorStaus = async (req, res, next) => {

    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ success: false, message: "Moderator ID required" });
    }

    const moderator = await Moderator.findById(id);

    if (!moderator) {
        return res.status(404).json({ success: false, message: "Moderator not found" });
    }

    const updatedStatus = moderator.status === "frozen" ? "active" : "frozen";

    await Moderator.findByIdAndUpdate(id, { status: updatedStatus }, { new: true });

    if (updatedStatus === "active") {

        return res.json({ success: true, message: "Moderator activated successfully" });

    } else if (updatedStatus === "frozen") {

        return res.json({ success: true, message: "Moderator frozen successfully" });

    } else {

        return res.status(500).json({ success: false, message: "Failed to update moderator status" });

    }
}

export const viewModerators = async (req, res, next) => {

    const moderators = await Moderator.find().select("-password");

    return res.json({ success: true, message: "Fetched moderator details", moderators });

}

export const showProducts = async (req, res, next) => {

    const products = await Product.find();
    return res.json({ success: true, message: "Success", data: products });

}

export const showOneProduct = async (req, res, next) => {

    const { id } = req.params;

    const product = await Product.findById(id);

    return res.json({ success: true, message: "Success", data: product });

}

export const showProductsByCategory = async (req, res, next) => {

    const category = await Category.find();

    return res.json({ success: true, message: "Success", data: category });
}

export const deleteCategory = async (req, res, next) => {

    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ success: false, message: "Category ID required" });
    }
    const response = await Category.findByIdAndDelete(id);

    if (!response) {
        return res.status(404).json({ success: false, message: "Category not found" });
    }

    return res.json({ success: true, message: "Category deleted successfully" });

}

export const addCategory = async (req, res, next) => {

    const { category, image } = req.body;

    if (!category) {
        return res.status(400).json({ success: false, message: "Category name required" });
    }

    const categoryExist = await Category.findOne({ name: category });

    if (categoryExist) {
        return res.status(404).json({ success: false, message: "Category already exist" });
    }

    const newCategory = new Category({ name: category, image });

    await newCategory.save();

    return res.status(200).json({ success: true, message: "Category added successfully" });
}

export const logout = (req, res, next) => {

    res.clearCookie("token");

    return res.status(200).json({ success: true, message: "User logged out successfully" });

}

export const fetchDatabaseDetails = async (req, res, next) => {

    const userCount = await User.countDocuments();
    if (!userCount) {
        return res.status(500).json({ success: false, message: "Failed to fetch user count" });
    }
    const categoryCount = await Category.countDocuments();
    if (!categoryCount) {
        return res.status(500).json({ success: false, message: "Failed to fetch category count" });
    }
    const moderatorCount = await Moderator.countDocuments();
    if (!moderatorCount) {
        return res.status(500).json({ success: false, message: "Failed to fetch moderator count" });
    }
    const productCount = await Product.countDocuments();
    if (!productCount) {
        return res.status(500).json({ success: false, message: "Failed to fetch product count" });
    }

    return res.json({ success: true, userCount, categoryCount, moderatorCount, productCount });
}