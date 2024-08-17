import axios from "axios";
import { Category } from "../models/categoryModel.js";
import { Product } from "../models/ProductModel.js";


export const uploading = async ( req, res, next ) => {

    // const response = await axios.get("https://api.escuelajs.co/api/v1/categories");
    
    // const data = response.data[1]
    // console.log(data)

    // for (let i = 0; i < 1; i++) {
    //     const { id, name, image } = await response.data[5]
    //     console.log(response.data[5].id)
    //     // console.log(id, name, image)
    //     const newCategory = new Category({ id, name, image });
    //      await newCategory.save();
    // }
    // console.log(id, name , image)

    const response = await axios.get("https://api.escuelajs.co/api/v1/products");

    console.log(response.data[0].images[0])
// for (let i = 0; i < response.data.length; i++) {
//         const { id, title, price, description, images, category } = await response.data[i]
//         let rating = Math.floor(Math.random() * 4) + 2;
//         // console.log(response.data[5].id)
//         // console.log(id, name, image)
//         const newProduct = new Product({ id, title, price, description, images, category, rating });
//          await newProduct.save();
//     }


    return res.json({success: true, message: "Success"});
}