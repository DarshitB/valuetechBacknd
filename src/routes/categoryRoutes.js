const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");

const auth = require("../middleware/auth"); // Middleware to verify JWT token and user authentication
const checkPermission = require("../middleware/permission"); // Middleware to verify user has required permission
const beforeUpdateLogger = require("../middleware/beforeUpdateLogger"); // Middleware to store old data before update for logging
const activityLogger = require("../middleware/activityLogger"); // Middleware to log user's activity (create, update, delete)

// Apply authentication middleware to all category routes
router.use(auth);

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Protected
 */
router.get("/", categoryController.getAll);

/**
 * @route   GET /api/categories/:id
 * @desc    Get single category by ID
 * @access  Protected
 */
router.get("/:id", categoryController.getById);

/**
 * @route   POST /api/categories
 * @desc    Create a new category
 * @access  Protected - Requires 'add_category' permission
 */
router.post(
  "/",
  checkPermission("add_category"), // Check if user has permission to add categories
  activityLogger("category", (req, res) => res.locals.newRecordId), // Log create action with new record ID
  categoryController.create
);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update an existing category
 * @access  Protected - Requires 'edit_category' permission
 */
router.put(
  "/:id",
  checkPermission("edit_category"), // Check if user has permission to edit categories
  beforeUpdateLogger("category", (req) => req.params.id), // Log old data before update
  activityLogger("category", (req) => req.params.id), // Log update activity
  categoryController.update
);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Soft delete a category (mark as deleted without removing from DB)
 * @access  Protected - Requires 'delete_category' permission
 */
router.delete(
  "/:id",
  checkPermission("delete_category"), // Check if user has permission to delete categories
  activityLogger("category", (req) => req.params.id), // Log delete activity
  categoryController.softDelete
);

module.exports = router;
