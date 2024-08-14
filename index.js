import express from "express";
import { connectDB } from "./config/db.js";
import apiRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;

// Connect to MongoDB Database
connectDB();

// use cookie sessions 
// app.use(
// 	cookieSession({
// 		maxAge: 1000 * 60 * 60 * 24,         // 1 day
// 		keys: [process.env.COOKIE_SESSION_KEY],
// 	})
// );

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", apiRouter);

app.all("*", (req, res, next) => {
  if (!res.headersSent) {
    res.status(404).json({ message: "End point does not exist" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
