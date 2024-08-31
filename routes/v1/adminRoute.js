import express from "express";
import { authAdmin } from "../../middlewares/authAdmin.js";
import { adminLogin, checkAdmin, deleteCategory, handleModeratorStaus, handleUserStaus, removeProduct, addCategory, viewModerators, viewUsers } from "../../controllers/adminController.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { upload } from "../../config/cloudinaryConfig.js";

const router = express.Router();

router.post("/login", asyncHandler(adminLogin));
router.get("/check-admin", authAdmin, asyncHandler(checkAdmin));
router.get("/view-users", asyncHandler(viewUsers));
router.get("/status-user/:id", asyncHandler(handleUserStaus));
router.get("/remove-product/:id", asyncHandler(removeProduct));
router.get("/status-moderator/:id", asyncHandler(handleModeratorStaus));
router.get("/view-moderators", viewModerators);
router.post("/add-category", upload.single('image'), asyncHandler(addCategory));
router.get("/delete-category", asyncHandler(deleteCategory));

export default router;