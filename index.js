import express from "express";
import { connectDB } from "./config/db.js";
import apiRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
// import session from "express-session";

const app = express();
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
     origin: [process.env.CLIENT_DOMAIN, "https://checkout.stripe.com"],
     allowedHeaders: ['Content-Type', 'Authorization'],
     credentials: true,
     optionSuccessStatus:200
  }

app.use(cors(corsOptions));

// Middlewares


const PORT = process.env.PORT;

// Connect to MongoDB Database
connectDB();

// app.use(session({
//   secret: "otp",
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false, maxAge: 300000 }
// }));

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
 