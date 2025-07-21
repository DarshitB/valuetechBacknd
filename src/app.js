const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");

// Import routes
const authRoutes = require("./routes/authRoutes");
const roleRoute = require("./routes/roleRoutes");
const userRoutes = require("./routes/userRoutes");
const permissionRoutes = require("./routes/permissionRoutes");
const stateRoutes = require("./routes/stateRoutes");
const cityRoutes = require("./routes/cityRoutes");

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://new.valuetechsolutions.org",
    "http://new.valuetechsolutions.org",
    "https://valuetechbacknd.onrender.com",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

// ✅ Apply CORS to all routes properly
app.use(cors(corsOptions));

// ✅ Fix: Handle OPTIONS preflight *with method, not wildcard path*
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.sendStatus(200); // reply OK to preflight request
  } else {
    next();
  }
});

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes); // /api/auth/login
app.use("/api/roles", roleRoute);
app.use("/api/users", userRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/states", stateRoutes);
app.use("/api/cities", cityRoutes);

app.use(errorHandler); // Error handling middleware

module.exports = app;
