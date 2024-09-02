import express from "express";
import { authAdmin } from "../../middlewares/authAdmin.js";
import { adminLogin, checkAdmin, deleteCategory, handleModeratorStaus, handleUserStaus, removeProduct, addCategory, viewModerators, viewUsers } from "../../controllers/adminController.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { upload } from "../../config/cloudinaryConfig.js";

const router = express.Router();

router.post("/login", asyncHandler(adminLogin));
router.get("/check-admin", asyncHandler(authAdmin), asyncHandler(checkAdmin));
router.get("/view-users", asyncHandler(authAdmin), asyncHandler(viewUsers));
router.put("/update-user-status/:id", asyncHandler(authAdmin), asyncHandler(handleUserStaus));
router.get("/view-moderators", asyncHandler(authAdmin), asyncHandler(viewModerators));
router.put("/update-moderator-status/:id", asyncHandler(authAdmin), asyncHandler(handleModeratorStaus));
router.delete("/remove-product/:id", asyncHandler(removeProduct));
router.delete("/delete-category", asyncHandler(deleteCategory));

export default router;