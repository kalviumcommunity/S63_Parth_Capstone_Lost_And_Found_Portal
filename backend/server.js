const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import routes
const lostItemRoutes = require("./routes/lostItemRoutes");
const foundItemRoutes = require("./routes/foundItemRoutes");
const userRoutes = require("./routes/userRoutes");

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
app.use("/api/users", userRoutes); // Updated route for consistency

// Root route (optional health check or welcome message)
app.get("/", (req, res) => {
  res.send("🌐 Founder's Hub API is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
