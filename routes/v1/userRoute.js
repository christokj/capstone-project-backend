import express from "express";
import { checkUser, updateUserProfile, userCreate, userLogin, userLogout, userProfile } from "../../controllers/userController.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { authUser } from "../../middlewares/authUser.js";

const router = express.Router();

router.post("/create", asyncHandler(userCreate));
router.post("/login", asyncHandler(userLogin));
router.post("/logout", authUser, asyncHandler(userLogout));
router.get("/profile/:id", authUser, asyncHandler(userProfile));
router.get("/check-user", authUser, asyncHandler(checkUser));
router.put("/profile/:id",  asyncHandler(updateUserProfile))

export default router;
