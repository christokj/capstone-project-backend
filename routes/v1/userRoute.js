import express from "express";
import { addToCart, checkUser, fetchUserDetails, otpHandler, updateUserProfile, userCreate, userLogin, userLogout, userProfile } from "../../controllers/userController.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { authUser } from "../../middlewares/authUser.js";
import { otpSender } from "../../middlewares/otpSender.js";
import { searchProducts, showOneProduct, showProducts, showProductsByCategory } from "../../controllers/productController.js";
// import { uploading } from "../../controllers/productController.js";

const router = express.Router();

router.post("/create", asyncHandler(userCreate));
router.post("/login", asyncHandler(userLogin));
router.post("/logout", authUser, asyncHandler(userLogout));
router.get("/profile/:id", authUser, asyncHandler(userProfile));
router.get("/check-user", authUser, asyncHandler(checkUser));
router.post("/otp-handler/:id", asyncHandler(otpHandler)); 
router.get("/otp-handler/:id", asyncHandler(otpSender), asyncHandler(otpHandler));
router.get("/fetch-user-data/:id", asyncHandler(fetchUserDetails));
router.put("/update-user-details/:id", asyncHandler(updateUserProfile));
// router.get("/uploading", uploading);  
router.get("/show-products", asyncHandler(showProducts));
router.get("/show-one-product/:id", asyncHandler(showOneProduct));
router.get("/product-category", asyncHandler(showProductsByCategory));
router.post("/search-products", asyncHandler(searchProducts));
router.post("/add-Cart", asyncHandler(addToCart));


export default router;
