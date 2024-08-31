import express from "express";
import userRoute from "./userRoute.js";
import adminRoute from "./adminRoute.js";
import moderatorRoute from "./moderatorRoute.js";
import paymentRoute from "./paymentRoute.js";

const v1Router = express.Router();

v1Router.use("/user", userRoute);
v1Router.use("/admin", adminRoute);
v1Router.use("/moderator", moderatorRoute);
v1Router.use("/payment", paymentRoute );

export default v1Router;
