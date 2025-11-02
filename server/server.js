const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/dbConn");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes")
const verifyJWT = require("./middleware/verifyJWT");
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3001",
  credentials: true,
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/api", (req, res) => {
  res.send("Server is running!");
});

// Routes
app.use("/auth", authRoutes);

// Example protected route
app.get("/profile", verifyJWT, (req, res) => {
  res.status(200).json({ message: `Welcome ${req.user.username}`, data: req.user, statusCode: 200, success: true });
});



// Catch-all route for 404 errors - must be last
app.use((req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
