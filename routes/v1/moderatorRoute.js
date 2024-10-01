import express from "express";
import { addCategory, addProduct, checkModerator, moderatorCreate, moderatorLogin, moderatorLogout, profile, removeProduct, showProduct, showYourProducts, updateProduct, updateProfile, uploadImage, uploadImageLink } from "../../controllers/moderatorController.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { authModerator } from "../../middlewares/authModerator.js";
import multer from 'multer';
import { deleteCategory, showProductCategory, updateCategory } from "../../controllers/productController.js";


const router = express.Router();

const photosMiddleware = multer({ dest: '/tmp' });

router.post("/create", asyncHandler(moderatorCreate));
router.post("/login", asyncHandler(moderatorLogin));
router.get("/check-moderator", asyncHandler(authModerator), asyncHandler(checkModerator));
router.get("/logout", asyncHandler(authModerator), asyncHandler(moderatorLogout));
router.post("/upload", photosMiddleware.array('photos', 100), uploadImage);
router.post("/upload-link", uploadImageLink)
router.delete("/remove-product/:id", asyncHandler(authModerator), removeProduct)
router.post("/add-product", asyncHandler(authModerator), asyncHandler(addProduct));
router.get("/show-products", asyncHandler(authModerator), asyncHandler(showYourProducts));
router.get("/show-product/:id", asyncHandler(authModerator), asyncHandler(showProduct));
router.put("/update-product", asyncHandler(authModerator), asyncHandler(updateProduct))
router.post("/add-category", asyncHandler(authModerator), asyncHandler(addCategory))
router.get("/product-category/:id", asyncHandler(authModerator), asyncHandler(showProductCategory));
router.put("/update-category", asyncHandler(authModerator), asyncHandler(updateCategory))
router.delete("/remove-category/:id", asyncHandler(authModerator), asyncHandler(deleteCategory))
router.get("/profile", asyncHandler(authModerator), asyncHandler(profile))
router.put("/update-moderator-details", asyncHandler(authModerator), asyncHandler(updateProfile))

export default router;
