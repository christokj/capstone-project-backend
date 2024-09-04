import { Product } from "../models/productModel.js";
import { Category } from "../models/categoryModel.js";

export const showProducts = async (req, res, next) => {

    const products = await Product.find();
    return res.json({ success: true, message: "Success", data: products });

}

export const showOneProduct = async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    return res.json({ success: true, message: "Success", data: product });
}

export const showProductsCategory = async (req, res, next) => {

    const category = await Category.find()

    return res.json({ success: true, message: "Success", data: category });
}

export const showProductsByCategory = async (req, res, next) => {

    const category = await Category.findById(req.params.id);

    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    const products = await Product.find({ category: category.name });

    if (!products) return res.status(404).json({ success: false, message: "Products not found" });

    return res.json({ success: true, message: "Success", data: products });

}
export const searchProducts = async (req, res, next) => {

    const { searchTerm } = req.params;

    if (!searchTerm) {
        return res.status(400).json({ success: false, message: "Search value is required" });
    }

    const products = await Product.find({
        title: {
            $regex: `\\b${searchTerm}\\b`,
            $options: 'i'
        }
    });

    return res.json({ success: true, message: "Success", data: products });
}

export const showProductCategory = async (req, res, next) => {

    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ success: false, message: "Product ID required" });
    }

    const category = await Category.findById(id);

    if (!category) {
        return res.status(404).json({ success: false, message: "Category not found" });
    }

    return res.status(200).json({ success: true, message: "Success", category })
}

export const updateCategory = async (req, res, next) => {

    const { id, category, image } = req.body;

    if (!id || !category || !image) {
        return res.status(400).json({ success: false, message: " All fields required" });
    }

    const categoryDetails = await Category.findByIdAndUpdate(id, { name: category, image }, { new: true });

    if (!categoryDetails) {
        return res.status(404).json({ success: false, message: "Category not found" });
    }

    return res.status(200).json({ success: true, message: "Category updated successfully", category });
}

export const deleteCategory = async (req, res, next) => {

    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ success: false, message: "Category ID required" });
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
        return res.status(404).json({ success: false, message: "Category not found" });
    }

    return res.status(200).json({ success: true, message: "Category deleted successfully" });
}

