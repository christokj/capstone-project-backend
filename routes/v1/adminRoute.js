import express from "express";
import { authAdmin } from "../../middlewares/authAdmin.js";
import { adminLogin, checkAdmin, deleteCategory, handleModeratorStaus, handleUserStaus, removeProduct, addCategory, viewModerators, viewUsers, logout, fetchDatabaseDetails } from "../../controllers/adminController.js";
import asyncHandler from "../../utils/asyncHandler.js";
// import { upload } from "../../config/cloudinaryConfig.js";

const router = express.Router();

router.post("/login", asyncHandler(adminLogin));
router.get("/check-admin", asyncHandler(authAdmin), asyncHandler(checkAdmin));
router.get("/view-users", asyncHandler(authAdmin), asyncHandler(viewUsers));
router.put("/update-user-status/:id", asyncHandler(authAdmin), asyncHandler(handleUserStaus));
router.get("/view-moderators", asyncHandler(authAdmin), asyncHandler(viewModerators));
router.put("/update-moderator-status/:id", asyncHandler(authAdmin), asyncHandler(handleModeratorStaus));
router.delete("/remove-product/:id", asyncHandler(authAdmin), asyncHandler(removeProduct));
router.delete("/remove-category/:id", asyncHandler(authAdmin), asyncHandler(deleteCategory));
router.post("/add-category", asyncHandler(authAdmin), asyncHandler(addCategory))
router.get("/logout", asyncHandler(authAdmin), asyncHandler(logout))
router.get("/database-details", asyncHandler(authAdmin), asyncHandler(fetchDatabaseDetails))

export default router;