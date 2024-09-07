import express from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import { paymentControl, sessionStatus, webhook } from "../../controllers/paymentController.js";

const router = express.Router();


router.post("/create-checkout-session", asyncHandler(paymentControl));
router.get("/session-status", asyncHandler(sessionStatus));
router.post('/webhook', express.raw({type: 'application/json'}), asyncHandler(webhook));

export default router;
