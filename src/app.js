const express = require("express");
const cors = require("cors");
const path = require("path");
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
const orderRoutes = require("./routes/orderRoutes");
const fieldVerifierPortalOperationsRoutes = require("./routes/fieldVerifier/portalOperationsRoutes");
const mobileAuthRoutes = require("./routes/fieldVerifier/authRoutes");
const mobilApis = require("./routes/fieldVerifier/mobilApi");
const orderMediaRoutes = require("./routes/fieldVerifier/orderMediaRoutes");
const orderMediaPortalRoutes = require("./routes/orderMediaPortalRoutes");
const collageGeneratorRoutes = require("./routes/collageGeneratorRoutes");

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://new.valuetechsolutions.org",
    "http://new.valuetechsolutions.org",
    "https://valuetechbacknd.onrender.com",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "X-Requested-With",
    "Accept",
    "Origin",
    "Cache-Control",
    "X-File-Name"
  ],
  exposedHeaders: [
    "Content-Length",
    "Content-Type",
    "Content-Disposition"
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 200
};

// ✅ Apply CORS to all routes properly
app.use(cors(corsOptions));

// ✅ Handle OPTIONS preflight requests for all routes
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Max-Age", "86400"); // 24 hours
    res.status(200).end();
  } else {
    // Add security headers for all requests
    res.header("X-Content-Type-Options", "nosniff");
    res.header("X-Frame-Options", "DENY");
    res.header("X-XSS-Protection", "1; mode=block");
    next();
  }
});

// Configure body parser with larger limits for media uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  setHeaders: (res, filePath) => {
    // Set appropriate headers for media files
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.png') || filePath.endsWith('.gif')) {
      res.setHeader('Content-Type', 'image/' + filePath.split('.').pop());
    } else if (filePath.endsWith('.mp4') || filePath.endsWith('.avi') || filePath.endsWith('.mov')) {
      res.setHeader('Content-Type', 'video/' + filePath.split('.').pop());
    }
    // Cache media files for 1 hour
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }
}));

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
app.use("/api/orders", orderRoutes);
app.use("/api/field-verifiers", fieldVerifierPortalOperationsRoutes);
app.use("/api/order-media", orderMediaPortalRoutes);
app.use("/api/collage-generator", collageGeneratorRoutes);

/* mobile APIs */
app.use("/api/mobile/auth", mobileAuthRoutes);
app.use("/api/mobile/", mobilApis);
app.use("/api/mobile/media", orderMediaRoutes);

app.use(errorHandler); // Error handling middleware

module.exports = app;
