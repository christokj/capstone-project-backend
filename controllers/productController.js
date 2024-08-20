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

export const showProductsByCategory = async (req, res, next) => {

    const category = await Category.find();

    return res.json({ success: true, message: "Success", data: category });
}
export const searchProducts = async (req, res, next) => {

    const { search } = req.query;

    const products = await Product.find({ title: { $regex: search, $options: 'i' } });

    return res.json({ success: true, message: "Success", data: products });
}
