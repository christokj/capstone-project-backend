const express = require('express');
const cors = require('cors');
const { default: apiRouter } = require('./routes');
// require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;

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
  res.status(404).json({ message: "end point does not exist" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
