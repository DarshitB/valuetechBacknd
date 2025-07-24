const express = require("express");
const router = express.Router();

const cityController = require("../controllers/cityController");

const auth = require("../middleware/auth"); // Middleware to check authentication
const checkPermission = require("../middleware/permission"); // Middleware to check user permissions
const beforeUpdateLogger = require("../middleware/beforeUpdateLogger"); // Middleware to store old data on local temporary for add activity log
const activityLogger = require("../middleware/activityLogger"); // Middleware to log user activity

// Apply authentication middleware to all routes
router.use(auth);

// GET all cities
router.get("/", cityController.getAll);
// GET bank by ID
router.get("/:id", cityController.getById);
// CREATE a city
router.post(
  "/",
  checkPermission("add_cities"),
  activityLogger("cities", (req, res) => res.locals.newRecordId),
  cityController.create
);
// UPDATE a city by ID
router.put(
  "/:id",
  checkPermission("edit_cities"),
  beforeUpdateLogger("cities", (req) => req.params.id),
  activityLogger("cities", (req) => req.params.id),
  cityController.update
);
// SOFT DELETE a city
router.delete(
  "/:id",
  checkPermission("delete_cities"),
  activityLogger("cities", (req) => req.params.id),
  cityController.softDelete
);

module.exports = router;
