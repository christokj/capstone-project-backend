import express from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import { paymentControl, sessionStatus } from "../../controllers/paymentController.js";

const router = express.Router();


router.post("/create-checkout-session", asyncHandler(paymentControl));
router.get("/session-status", asyncHandler(sessionStatus));

export default router;
