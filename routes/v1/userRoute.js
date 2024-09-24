import express from "express";
import { addReview, addToCart, checkUser, fetchUserDetails, otpHandler, otpSender, removeFromCart, saveOrders, showCart, showOrders, showReview, updateCartQuantity, updateUserProfile, userCreate, userLogin, userLogout, userProfile } from "../../controllers/userController.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { authUser } from "../../middlewares/authUser.js";
import { searchProducts, showOneProduct, showProducts, showProductsCategory, showProductsByCategory } from "../../controllers/productController.js";

const router = express.Router();

router.post("/create", asyncHandler(userCreate));
router.post("/login", asyncHandler(userLogin));
router.get("/logout", asyncHandler(authUser), asyncHandler(userLogout));
router.get("/profile/:id", asyncHandler(authUser), asyncHandler(userProfile));
router.get("/check-user", asyncHandler(authUser), asyncHandler(checkUser));
router.post("/otp-sender", asyncHandler(otpSender));
router.post("/otp-handler", asyncHandler(otpHandler));
router.get("/fetch-user-data", asyncHandler(authUser), asyncHandler(fetchUserDetails));
router.put("/update-user-details", asyncHandler(authUser), asyncHandler(updateUserProfile));
router.get("/show-products", asyncHandler(showProducts));
router.get("/show-one-product/:id", asyncHandler(showOneProduct));
router.get("/products-category", asyncHandler(showProductsCategory));
router.get("/products-by-category/:id", asyncHandler(showProductsByCategory));
router.get("/search-products/:searchTerm", asyncHandler(searchProducts));
router.post("/add-cart", asyncHandler(authUser), asyncHandler(addToCart));
router.get("/show-cart", asyncHandler(authUser), asyncHandler(showCart));
router.delete("/remove-cart/:productId", asyncHandler(authUser), asyncHandler(removeFromCart));
router.post("/add-review", asyncHandler(authUser), asyncHandler(addReview))
router.get("/show-review/:id", asyncHandler(authUser), asyncHandler(showReview))
router.post("/save-orders", asyncHandler(authUser), asyncHandler(saveOrders))
router.get("/show-orders", asyncHandler(authUser), asyncHandler(showOrders))
router.put("/update-cart-quantity", asyncHandler(authUser), asyncHandler(updateCartQuantity))


export default router;
