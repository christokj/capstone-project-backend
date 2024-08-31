import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken.js';
import { User } from '../models/userModel.js';
import { Product } from '../models/productModel.js';
import { Moderator } from '../models/moderatorModel.js';
import { Category } from '../models/categorysModel.js';

export const adminLogin = async (req, res, next) => {
    const { email, password, role } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields required" });
    }
    // Directly access the 'admins' collection
    const adminExist = await mongoose.connection.collection('admins').findOne({ email, role: 'admin' });
    console.log(adminExist)

    if (!adminExist) {
        return res.status(404).json({ success: false, message: "Admin does not exist" });
    }

    const passwordMatch = bcrypt.compareSync(password, adminExist.password);

    if (!passwordMatch) {
        return res.status(400).json({ success: false, message: "Admin not authenticated" });
    }

    const token = generateToken(email, role);

    res.cookie("token", token);

    return res.json({ success: true, message: "Admin login successful" });
}


export const checkAdmin = async (req, res, next) => {

    const admin = req.admin;

    if (!admin) {
        return res.status(400).json({ success: true, message: "Admin not authenticated" });
    }
    return res.json({ success: true, message: "Admin authenticated" });

};

export const viewUsers = async (req, res, next) => {

    const users = await User.find().select("-password");

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

    await Product.findByIdAndDelete(id); // Find by id and removing product

    return res.json({ success: true, message: "Product removed successfully" });
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
    await Category.findByIdAndDelete(id);

    return res.json({ success: true, message: "Category deleted successfully" });

}

export const addCategory = async (req, res, next) => {

    const { name, id } = req.body;
    const imageUrl = req.file.path;

    new Category({
        name,
        image: imageUrl,
    });

    return res.json({ success: true, message: "Category added successfully" });
}