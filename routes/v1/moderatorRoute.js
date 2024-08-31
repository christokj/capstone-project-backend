import express from "express";
import { addProduct, checkModerator, moderatorCreate, moderatorLogin, moderatorLogout, removeProduct, showYourProducts, uploadImage, uploadImageLink } from "../../controllers/moderatorController.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { authModerator } from "../../middlewares/authModerator.js";
import multer from 'multer';

const router = express.Router();

const photosMiddleware = multer({dest:'/tmp'});
// const upload = multer({ storage: multer.memoryStorage() });

router.post("/create", asyncHandler(moderatorCreate));
router.post("/login", asyncHandler(moderatorLogin));
router.get("/check-moderator", asyncHandler(authModerator), asyncHandler(checkModerator));
router.post("/logout", asyncHandler(authModerator), asyncHandler(moderatorLogout));
router.post("/upload", photosMiddleware.array('photos', 100), uploadImage);//
router.post("/upload-link", uploadImageLink)
router.get("/remove-product", removeProduct)
router.post("/add-product", asyncHandler(authModerator), asyncHandler(addProduct));
router.get("/add-product", asyncHandler(authModerator), asyncHandler(showYourProducts))

export default router;
