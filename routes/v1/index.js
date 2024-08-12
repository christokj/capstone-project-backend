import express from "express";
import userRouter from "./userRoute.js";
import courseRouter from "./courseRoute.js";
import instructorRouter from './instructorRoute.js'

const v1Router = express.Router();

v1Router.use("/user", userRouter);
v1Router.use("/course", courseRouter);
v1Router.use("/instructor", instructorRouter );

export default v1Router;
