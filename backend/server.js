const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
require("./config/cloudinaryConfig")

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import routes
const lostItemRoutes = require("./routes/lostItemRoutes");
const foundItemRoutes = require("./routes/foundItemRoutes");
const userRoutes = require("./routes/userRoutes");
const userReportsRoutes = require("./routes/userReportsRoutes");
const path = require("path");
const searchRoutes = require("./routes/items");
const claimRoutes = require("./routes/claimRoutes");
const contactRoutes = require("./routes/contactRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Define routes
app.use("/api/lost-items", lostItemRoutes);
app.use("/api/found-items", foundItemRoutes);
app.use("/api/users", userRoutes);
app.use("/api/user", userReportsRoutes);
app.use("/api", searchRoutes);
app.use("/api/claims", claimRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/contact", contactRoutes); // <<<--- REGISTER contact routes
app.use("/api/dashboard", dashboardRoutes); // Register dashboard routes

// Root route (optional health check or welcome message)
app.get("/", (req, res) => {
  res.send("🌐 Founder's Hub API is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);