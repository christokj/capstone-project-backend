import mongoose from "mongoose";
import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";
import { passHashing } from "../utils/passwordHashing.js";
import { validateUserData } from "../validations/signUpJoi.js";
import bcrypt from 'bcrypt';
import { Cart } from "../models/cartModel.js";
import jwt from "jsonwebtoken";
import { generateOTP, getOTP, sendOTP } from "../utils/otpService.js";
import OTP from "../models/otpModel.js";

export const userCreate = async (req, res, next) => {
    const data = req.body

    const validatedData = await validateUserData(data);

    if (!validatedData.success) {
        return res.status(400).json({ success: false, message: "Invalid data", error: validatedData.message });
    }

    const { fullname, email, password, mobile, address } = validatedData.value;

    if (!fullname || !email || !password || !mobile || !address) {
        return res.status(400).json({ success: false, message: "All fields required" });
    }

    const userExist = await User.findOne({ email }).select("-password");
    if (userExist) {
        return res.status(400).json({ success: false, message: "User already exists" });
    }

    //hashing
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = bcrypt.hashSync(password, salt);

    //create new user
    const newUser = new User({ fullname, email, password: hashedPassword, mobile, address, status: 'inactive' });
    await newUser.save();

    return res.json({ success: true, message: "User created successfully", email });

}

export const userLogin = async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields required" });
    }

    const userExist = await User.findOne({ email });

    if (!userExist) {
        return res.status(404).json({ success: false, message: "User does not exist" });
    }

    if (userExist.status == "inactive") {

        return res.status(400).json({ success: false, message: "Your account is inactive", email });
    }

    if (userExist.status == "frozen") {

        return res.status(400).json({ success: false, message: "Your account is frozen", email });
    }

    const passwordMatch = bcrypt.compareSync(password, userExist.password);

    if (!passwordMatch) {
        return res.status(400).json({ success: false, message: "User not authenticated" });
    }

    if (userExist.status === "frozen") {
        return res.status(400).json({ success: false, message: "User account is frozen" });
    }

    const token = generateToken(email);

    const isProduction = process.env.NODE_ENV === "production";
    // console.log(isProduction,'====idProduction');
    
    res.cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        secure: isProduction, // Secure only in production
        sameSite: isProduction ? "None" : "Lax", // 'None' for production, 'Lax' for development
    });

    return res.json({ success: true, message: "User login successfully", token });
}

export const userLogout = async (req, res, next) => {

    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("token",{
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        secure: isProduction, // Secure only in production
        sameSite: isProduction ? "None" : "Lax", // 'None' for production, 'Lax' for development
    });

    res.json({ success: true, message: "User logout successfully" });

};

export const userProfile = async (req, res, next) => {

    const { id } = req.params;
    const useData = await User.findById(id).select("-password");

    res.json({ success: true, message: "User data fetched", data: useData });

};

export const checkUser = async (req, res, next) => {

    const user = req.user;
    if (!user) {
        return res.status(400).json({ success: true, message: "User not authenticated" });
    }

    return res.status(200).json({ success: true, message: "User authenticated" });

};

export const otpSender = async (req, res, next) => {

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email id not found' });
    }

    await OTP.findOneAndDelete({email})

    // Generating OTP
    const otp = generateOTP();

    if (!otp) {
        return res.status(500).json({ success: false, message: 'Failed to generate OTP' });
    }

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    // Store OTP in MongoDB
    const newOtp = new OTP({
        email,
        otp,
        expiresAt,
    });

    await newOtp.save();

    await sendOTP({
        from: process.env.EMAIL_ADMIN,
        to: email,
        subject: 'Your OTP Code',
        emailHtml: `<p>Your OTP code is ${otp}. It will expire in 5 minutes.</p>`,
    });

    return res.status(200).json({ success: true, message: 'OTP sent to your email' });

}   

export const otpHandler = async (req, res, next) => {

    const { email, otp } = req.body;

    if (!otp) {
        return res.status(400).json({ success: false, message: 'OTP required' });
    }

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email id required' });
    }

    const otpRecord = await OTP.findOne({ email }).sort({ expiresAt: -1 });

    if (!otpRecord) {
        return res.status(400).json({ success: false, message: 'OTP not found' });
    }

    if (otpRecord.expiresAt < new Date()) {
        return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    if (otpRecord.otp === otp) {
        await User.findOneAndUpdate({ email }, { status: 'active' });

        await OTP.deleteOne({ _id: otpRecord._id });

        return res.status(200).json({ success: true, message: 'OTP verified' });
    }
    
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
};

export const fetchUserDetails = async (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    // Verify token and get user ID
    let decoded;

    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);


    const email = decoded.email;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
    }

    const userId = user._id;
    const useData = await User.findById(userId).select("-password");
    return res.json({ success: true, message: "User data fetched", data: useData });
}

export const updateUserProfile = async (req, res, next) => {

    const { fullname, email, password, mobile, address } = req.body;

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    // Verify token and get user ID
    let decoded;

    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);


    const emailId = decoded.email;
    const userData = await User.findOne({ email: emailId });

    if (!userData) {
        return res.status(401).json({ success: false, message: 'User not found' });
    }

    const id = userData._id;


    if (!fullname || !email || !password || !mobile || !address) {
        return res.status(400).json({ success: false, message: "All fields required" });
    }

    const mobilePattern = /^\d{10,}$/;

    if (!mobilePattern.test(mobile)) {
        return res.status(400).json({ success: false, message: "Invalid mobile number. It must have more than 10 digits." });
    }

    //hashing
    const hashedPassword = await passHashing(password);

    const user = await User.findByIdAndUpdate(id,
        { fullname, email, password: hashedPassword, mobile, address },
        { new: true, runValidators: true } // It will return the updated document
    );

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: 'User updated successfully', user });

}

export const addToCart = async (req, res, next) => {
    const { productId, quantity } = req.body;

    // Retrieve token from cookies
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    // Verify token and get user ID
    let decoded;

    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);


    const email = decoded.email;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
    }

    const userId = user._id;

    // Find the user's cart
    let cart = await Cart.findOne({ userId });

    // Find the product to add
    const product = await Product.findById(productId);

    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const productPrice = product.price;
    const productDetails = {
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        image: product.image,
        shopName: product.shopName,
        rating: product.rating,
        quantity,
    };

    // If the cart doesn't exist, create a new one
    if (!cart) {
        cart = new Cart({
            userId,
            products: [{ productId, quantity, productDetails }],
            totalPrice: Math.round((productPrice * 83) * quantity),
        });
    } else {
        // Check if the product already exists in the cart
        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

        if (productIndex >= 0) {
            // If the product is already in the cart, update the quantity and product details
            cart.products[productIndex].productDetails.quantity += quantity;
            // Optionally, update productDetails if they might change; usually, they don't.
            cart.totalPrice += Math.round((productPrice * 83) * quantity);
        } else {
            // If the product is not in the cart, add it
            cart.products.push({ productId, productDetails });
            cart.totalPrice += Math.round((productPrice * 83) * quantity);
        }
    }

    // Save the cart
    await cart.save();

    return res.json({ success: true, message: 'Product added to cart successfully' });
}

export const showCart = async (req, res, next) => {

    // Retrieve token from cookies
    const token = req.cookies.token;


    if (token === null) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    // Verify token and get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const email = decoded.email;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
    }
    const userId = user._id;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    // Find the user's cart
    const cart = await Cart.find({ userId: userId });

    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    return res.status(200).json({ success: true, message: 'User cart fetched successfully', cart });
}

export const removeFromCart = async (req, res, next) => {
    const { productId } = req.params;

    // Retrieve token from cookies
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    // Verify token and get user ID
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const email = decoded.email;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
    }

    const userId = user._id;

    // Find the user's cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    // Find the index of the product in the cart
    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

    if (productIndex === -1) {
        return res.status(404).json({ success: false, message: 'Product not found in cart' });
    }

    // Get the quantity and price of the product
    const productQuantity = cart.products[productIndex].productDetails.quantity;
    const productPrice = cart.products[productIndex].productDetails.price;

    // Update the total price
    cart.totalPrice -= productPrice * productQuantity;

    // Remove the product from the cart
    cart.products.splice(productIndex, 1);

    // If the cart is empty after removal, reset the total price to 0
    if (cart.products.length === 0) {
        cart.totalPrice = 0;
    }

    // Save the updated cart
    await cart.save();

    return res.status(200).json({ success: true, message: 'Product removed from cart successfully' });
};

export const addToOrder = async (req, res, next) => {

    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
        return res.status(400).json({ success: false, message: "All fields required" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    const orderItem = user.orderHistory.find(item => item.productId.toString() === productId);

    if (orderItem) {
        // If the product is already in the cart, update the quantity
        orderItem.quantity += quantity;
    } else {
        // If the product is not in the cart, add it as a new item
        user.orderHistory.push({ productId, quantity });
    }

    user.orderHistory.total = user.orderHistory.reduce((acc, item) => acc + item.quantity, 0);

    await user.save();

    return res.json({ success: true, message: 'Product added to orders successfully', user });

}

export const showOrders = async (req, res, next) => {

    const { token } = req.cookies;
    if (!token) {
        return res.status(400).json({ success: false, message: "user not authenticated" });
    }
    const tokenVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const { email } = tokenVerified;

    const userId = await User.findOne({ email }).select('_id'); 

    const userOrders = await User.findById(userId).select('orderHistory').populate({
        path: 'orderHistory.productId', // Populate the productId within orderHistory
    });
console.log(userOrders)
    if (!userOrders) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: 'User orders fetched successfully', orderHistory: userOrders.orderHistory });

}

export const addReview = async (req, res, next) => {

    const {review, id}  = req.body
    const {token} = req.cookies;

    if (!token) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    let decoded;

    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const email = decoded.email;
    
    const userName = await User.findOne({ email: email }, 'fullname');

    if (!userName) {
        return res.status(404).json({ success: false, message: 'User name not found' });
    }

    const {fullname} = userName

    // await Product.findByIdAndUpdate(id, {reviews: {message: review, userName: fullname}})
    const product = await Product.findById(id)

    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const newReview = {
        userName: fullname,
        message: review
    };

    product.reviews.push(newReview);

    await product.save();

    return res.status(200).json({ success: true, message: 'Review added successfully' });

}  

export const showReview = async (req, res, next) => {

    const { id } = req.params;

    // Fetch the product by ID and only retrieve the 'reviews' field
    const product = await Product.findById(id, 'reviews');

    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.status(200).json({ success: true, data: product.reviews });
}

export const saveOrders = async (req, res, next) => {

    const { productsData } = req.body;
    const parsedProductsData = JSON.parse(productsData);

    const { token } = req.cookies;
    if (!token) {
        return res.status(400).json({ success: false, message: "user not authenticated" });
    }
    const tokenVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const { email } = tokenVerified;

    const userId = await User.findOne({ email }).select('_id'); 

    if (parsedProductsData && parsedProductsData.length > 0) {
        try {
            for (const product of parsedProductsData) {
                await User.findByIdAndUpdate(
                    userId,
                    {
                        $push: {orderHistory: {productId: product.productId, quantity: product.quantity,},},
                    }
                );
            }

            await Cart.deleteOne({userId})
            
            return res.status(200).json({ success: true, message: 'Products logged successfully' });
        } catch (error) {
            console.error('Error updating user:', error);
            return res.status(500).json({ success: false, message: 'Error logging products' });
        }
    } else {
        console.log('No products found');
        return res.status(400).json({ success: false, message: 'No products found to log' });
    }

}
export const updateCartQuantity = async (req, res, next) => {

    const { productId, quantity } = req.body;
    const { token } = req.cookies;
    if (!token) {
        return res.status(400).json({ success: false, message: "user not authenticated" });
    }
    const tokenVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const { email } = tokenVerified;

    const userId = await User.findOne({ email }).select('_id'); 

    const cart = await Cart.findOne({ userId });

    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }

    const product = cart.products.find(p => p.productId.toString() === productId);

    if (!product) {
        return res.status(404).json({ message: "Product not found in cart" });
    }

    product.productDetails.quantity = quantity;

    cart.totalPrice = cart.products.reduce((total, item) => {
        return total + (item.productDetails.price * item.productDetails.quantity);
    }, 0);

    cart.totalPrice *= 83
    await cart.save();

    return res.status(200).json({ message: "Quantity updated successfully" });
}