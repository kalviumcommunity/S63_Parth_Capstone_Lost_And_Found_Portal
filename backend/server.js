const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const lostItemRoutes = require("./routes/lostItemRoutes");
const foundItemRoutes = require("./routes/foundItemRoutes");

// Initialize Express App
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected", process.env.MONGO_URI))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/items", lostItemRoutes);
app.use("/api/items", foundItemRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to Founder's Hub API");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
