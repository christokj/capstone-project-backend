import express from "express";
import { authAdmin } from "../../middlewares/authAdmin.js";
import { adminLogin } from "../../controllers/adminController.js";
import asyncHandler from "../../utils/asyncHandler.js";

const router = express.Router();

router.post("/login", asyncHandler(adminLogin) );


export default router;