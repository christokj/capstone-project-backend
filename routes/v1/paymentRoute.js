import express from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import { emailHandler, paymentControl, sessionStatus } from "../../controllers/paymentController.js";
import { authUser } from "../../middlewares/authUser.js";

const router = express.Router();


router.post("/create-checkout-session", asyncHandler(authUser), asyncHandler(paymentControl));
router.get("/session-status", asyncHandler(authUser), asyncHandler(sessionStatus));
router.post("/emailHandler", asyncHandler(authUser), asyncHandler(emailHandler));
// router.post('/webhook', express.raw({type: 'application/json'}), asyncHandler(webhook));

export default router;
