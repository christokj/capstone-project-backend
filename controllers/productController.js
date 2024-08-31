import { Product } from "../models/productModel.js";
import { Category } from "../models/categorysModel.js";

// export const uploading = async ( req, res, next ) => {

//     // const response = await axios.get("https://api.escuelajs.co/api/v1/categories");

//     // const data = response.data[1]
//     // console.log(data)

//     // for (let i = 0; i < 1; i++) {
//     //     const { id, name, image } = await response.data[5]
//     //     console.log(response.data[5].id)
//     //     // console.log(id, name, image)
//     //     const newCategory = new Category({ id, name, image });
//     //      await newCategory.save();
//     // }
//     // console.log(id, name , image)

//     // const response = await axios.get(`https://fakestoreapi.com/products/1`);

//     // console.log(response.data)
//     for (let i = 1; i < 21 ; i++) {
//         const response = await axios.get(`https://fakestoreapi.com/products/${i}`);
//         const { id, title, price, description, image, category } = await response.data
//         // let rating = Math.floor(Math.random() * 4) + 2;
//         const { rating } = await response.data.rating
//         // console.log(response.data[5].id)
//         // console.log(id, name, image)
//         const newProduct = new Product({ id, title, price, description, image, category, rating });
//          await newProduct.save();
//     }

//     return res.json({success: true, message: "Success"});
// }


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

// export const showProductsById = async (req, res, next) => {

//     const productsId = req.body;

//     if (!productsId.length) return res.status(400).json({ success: false, message: "Products IDs are required" });

//     const products = await Product.find({ _id: { $in: productsId } });

//     return res.json({ success: true, message: "Success", data: products });

// }

export const showProductsByCategory = async ( req, res, next ) => {

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
