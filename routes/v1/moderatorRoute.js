import express from "express";
import { moderatorCreate, moderatorLogin, moderatorLogout } from "../../controllers/moderatorController.js";
import asyncHandler from "../../utils/asyncHandler.js";

const router = express.Router();

router.post("/create", asyncHandler(moderatorCreate));
router.post("/login", asyncHandler(moderatorLogin));
router.post("/logout", asyncHandler(moderatorLogout));


export default router;
