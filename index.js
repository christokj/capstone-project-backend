import express from "express";
import { connectDB } from "./config/db.js";
import apiRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
// import session from "express-session";

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [process.env.CLIENT_DOMAIN, "https://checkout.stripe.com"];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if the incoming origin is in the list of allowed origins
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // Origin is allowed
    } else {
      callback(new Error('Not allowed by CORS')); // Origin is not allowed
    }
  },
  credentials: true, // Allow credentials (cookies, etc.)
  optionSuccessStatus: 200 // Success status for older browsers (IE11, etc.)
};

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
 