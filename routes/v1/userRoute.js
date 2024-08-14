import express from "express";
import { userCreate } from "../../controllers/userController.js";
import asyncHandler from "../../utils/asyncHandler.js";
// import { checkUser, userCreate, userLogin, userProfile } from "../../controllers/userController.js";
// import { authUser } from "../../middlewares/authUser.js";
const router = express.Router();

router.post("/create", asyncHandler(userCreate));
// router.post("/login", userLogin);
// router.get("/profile/:id", authUser, userProfile);


// router.get("/check-user", authUser, checkUser);


export default router;
