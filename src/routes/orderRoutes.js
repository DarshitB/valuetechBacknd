const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");

const auth = require("../middleware/auth"); // Middleware to check authentication
const checkPermission = require("../middleware/permission"); // Middleware to check user permissions
const beforeUpdateLogger = require("../middleware/beforeUpdateLogger"); // Middleware to store previous data before update
const activityLogger = require("../middleware/activityLogger"); // Middleware to log user activity

// Apply authentication middleware to all routes
router.use(auth);

router.get("/", orderController.getAll);
router.get("/:id", orderController.getById);
router.post(
  "/",
  checkPermission("add_order"), // Check permission to add order
  activityLogger("orders", (req, res) => res.locals.newRecordId), // Log creation
  orderController.create
);
router.put(
  "/:id",
  checkPermission("edit_order"), // Check permission to edit order
  beforeUpdateLogger("orders", (req) => req.params.id), // Store pre-update data
  activityLogger("orders", (req) => req.params.id), // Log update
  orderController.update
);
router.delete(
  "/:id",
  checkPermission("delete_order"), // Check permission to delete order
  activityLogger("orders", (req) => req.params.id), // Log deletion
  orderController.softDelete
);

module.exports = router;
