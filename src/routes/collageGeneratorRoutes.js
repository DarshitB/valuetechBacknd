const express = require("express");
const router = express.Router();

const collageGeneratorController = require("../controllers/collageGeneratorController");

const auth = require("../middleware/auth"); // Middleware to check authentication
const checkPermission = require("../middleware/permission"); // Middleware to check user permissions
const activityLogger = require("../middleware/activityLogger"); // Middleware to log user activity

router.use(auth); // Apply authentication middleware to all routes

router.post(
  "/generate",
  checkPermission("collage.generate"), // Check if user has permission to generate collages
  activityLogger("collage_generation", (req, res) => res.locals.documentId), // Log collage generation activity
  collageGeneratorController.generateCollage
);

router.get(
  "/:orderId",
  checkPermission("collage.view"), // Check if user has permission to view collages
  collageGeneratorController.getCollagesByOrderId
);

router.delete(
  "/:id",
  checkPermission("collage.delete"), // Check if user has permission to delete collages
  activityLogger("collage_deletion", (req) => req.params.id), // Log collage deletion activity
  collageGeneratorController.deleteCollage
);

module.exports = router;
