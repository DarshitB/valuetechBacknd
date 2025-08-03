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
const bankRoutes = require("./routes/bankRoutes");
const bankBranchRoutes = require("./routes/bankBranchRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const subcategoryRoutes = require("./routes/subcategoryRoutes");
const childCategoryRoutes = require("./routes/childCategoryRoutes");
const officerRouter = require("./routes/officerRouter");
const fieldVerifierPortalOperationsRoutes = require("./routes/fieldVerifier/portalOperationsRoutes");
const mobileAuthRoutes = require("./routes/fieldVerifier/authRoutes");

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://new.valuetechsolutions.org",
    "http://new.valuetechsolutions.org",
    "https://valuetechbacknd.onrender.com",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"], // 👈 Add this line
  credentials: true,
};

// ✅ Apply CORS to all routes properly
app.use(cors(corsOptions));

// ✅ Fix: Handle OPTIONS preflight *with method, not wildcard path*
/* app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.sendStatus(200); // reply OK to preflight request
  } else {
    next();
  }
}); */

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes); // /api/auth/login
app.use("/api/roles", roleRoute);
app.use("/api/users", userRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/states", stateRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/bank", bankRoutes);
app.use("/api/bank-branch", bankBranchRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/child-categories", childCategoryRoutes);
app.use("/api/officers", officerRouter);
app.use("/api/field-verifiers", fieldVerifierPortalOperationsRoutes);

/* mobile APIs */
app.use("/api/mobile/auth", mobileAuthRoutes);

app.use(errorHandler); // Error handling middleware

module.exports = app;
