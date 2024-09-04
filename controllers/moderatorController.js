import bcrypt from "bcrypt";
import { Moderator } from "../models/moderatorModel.js";
import { generateToken } from "../utils/generateToken.js";
import validateModeratorData from "../validations/moderatorJoi.js";
import { uploadToS3 } from "../utils/awsCred.js";
import { Product } from "../models/productModel.js";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import imageDownloader from 'image-downloader';
import mime from 'mime-types';
import { User } from "../models/userModel.js";
import { Category } from "../models/categoryModel.js";
import { passHashing } from "../utils/passwordHashing.js";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const moderatorCreate = async (req, res, next) => {

    const { data } = req.body;

    const validatedData = await validateModeratorData(data);

    const { fullname, email, password, mobile } = validatedData.value;

    if (!fullname || !email || !password || !mobile) {
        return res.status(400).json({ success: false, message: "All fields required" });
    }

    const moderatorExist = await Moderator.findOne({ email, role: 'moderator' });

    if (moderatorExist) {
        return res.status(404).json({ success: false, message: "Moderator already exist" });
    }

    //hashing
    const salt = 10;
    const hashedPassword = bcrypt.hashSync(password, salt);

    //create new user
    const newModerator = new Moderator({ fullname, email, password: hashedPassword, mobile, role: "moderator" });
    await newModerator.save();

    //create token
    const token = generateToken(email, "moderator");

    res.cookie("token", token);
    res.json({ success: true, message: "Moderator created successfully" });

};

export const moderatorLogin = async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields required" });
    }

    const moderatorExist = await Moderator.findOne({ email });

    if (!moderatorExist) {
        return res.status(404).json({ success: false, message: "Moderator does not exist" });
    }

    if (moderatorExist.status == "inactive") {

        return res.status(400).json({ success: false, message: "Your account is inactive", email });
    }

    if (moderatorExist.status == "frozen") {

        return res.status(400).json({ success: false, message: "Your account is frozen", email });
    }

    const passwordMatch = bcrypt.compareSync(password, moderatorExist.password);

    if (!passwordMatch) {
        return res.status(400).json({ success: false, message: "Moderator not authenticated" });
    }

    const token = generateToken(email, moderatorExist.role, moderatorExist.shopName);

    res.cookie("token", token);

    return res.json({ success: true, message: "Moderator login successfully", token });
}

export const moderatorLogout = async (req, res, next) => {

    res.clearCookie("token"); // clearing cookies

    return res.json({ success: true, message: "Moderator logout successfully" });

};

export const checkModerator = async (req, res, next) => {

    const moderator = req.moderator;

    if (!moderator) {
        return res.status(400).json({ success: true, message: "Moderator not authenticated" });
    }
    return res.status(200).json({ success: true, message: "Moderator authenticated" });

};


export const addProduct = async (req, res, next) => {

    const { title, description, price, category, image } = req.body;
    const { shopName } = req.moderator

    if (!title || !description || !price || !category || !shopName || !image) {
        return res.status(400).json({ success: false, message: "All fields required" });
    }
    const product = await Product.create({ category, price, title, image, description, shopName });

    if (!product) {
        return res.status(400).json({ success: false, message: "Failed to add product" });
    }

    res.status(200).json({ message: 'Product added successfully' });
};

export const uploadImage = async (req, res, next) => {

    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const { path, originalname, mimetype } = req.files[i];
        const url = await uploadToS3(path, originalname, mimetype);
        uploadedFiles.push(url);
    }
    res.json(uploadedFiles);

}

export const uploadImageLink = async (req, res, next) => {

    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: '/tmp/' + newName,
    });
    const url = await uploadToS3('/tmp/' + newName, newName, mime.lookup('/tmp/' + newName));
    res.json(url);

}

export const showYourProducts = async (req, res, next) => {

    const user = req.moderator;
    const { email } = user
    const moderatorDetails = await Moderator.find({ email }).select("-password");

    if (!moderatorDetails) {
        return res.status(404).json({ success: false, message: "Moderator details not found" });
    }

    const products = await Product.find({ shopName: moderatorDetails[0].shopName });

    if (!products) {
        return res.status(404).json({ success: false, message: "Products not found" });
    }

    return res.json({ success: true, message: "Success", data: products });

}

export const removeProduct = async (req, res, next) => {

    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ success: false, message: "Product ID required" });
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: "Product removed successfully" });

}

export const showProduct = async (req, res, next) => {

    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ success: false, message: "Product ID required" });
    }

    const product = await Product.findById(id);

    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.json({ success: true, message: "Success", product });
}

export const updateProduct = async (req, res, next) => {

    const { id, title, description, price, category, shopName, image } = req.body;

    if (!id || !title || !description || !price || !category || !shopName || !image) {

        return res.status(400).json({ success: false, message: "All fields required" });
    }
    const product = await Product.findByIdAndUpdate(id, { title, description, price, category, shopName, image }, { new: true });

    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.json({ success: true, message: "Product updated successfully", data: product });
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

export const profile = async (req, res, next) => {

    const { email } = req.moderator

    if (!email) {
        return res.status(401).json({ success: false, message: "User not authenticated" });
    }
    const moderatorDetails = await Moderator.findOne({ email }).select("-password");

    if (!moderatorDetails) {
        return res.status(404).json({ success: false, message: "Moderator details not found" });
    }

    return res.status(200).json({ success: true, message: "Success", data: moderatorDetails });
}

export const updateProfile = async (req, res, next) => {
    const { email, fullname, mobile, password, shopName } = req.body;

    if (!email || !fullname || !mobile || !password || !shopName) {
        return res.status(400).json({ success: false, message: "All fields required" });
    }

    const hashedPassword = await passHashing(password);

    const moderator = await Moderator.findOneAndUpdate({ email }, { fullname, mobile, password: hashedPassword, shopName }, { new: true });

    if (!moderator) {
        return res.status(404).json({ success: false, message: "Moderator not found" });
    }

    return res.status(200).json({ success: true, message: "Profile updated successfully", data: moderator });
}