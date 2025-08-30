const express = require("express");
const router = express.Router();
const orderMediaPortalController = require("../controllers/orderMediaPortalController");
const auth = require("../middleware/auth"); // Assuming you have auth middleware for portal
const permission = require("../middleware/permission"); // Assuming you have permission middleware

// Apply authentication middleware to all routes
router.use(auth);

// Apply permission middleware if needed
// router.use(permission);

/**
 * GET /api/portal/order-media/:orderId
 * Get all media records for a specific order
 */
router.get("/:orderId", orderMediaPortalController.getOrderMedia);

/**
 * GET /api/portal/order-media/:orderId/count
 * Get count of media records for a specific order
 */
router.get("/:orderId/count", orderMediaPortalController.getOrderMediaCount);

/**
 * PATCH /api/portal/order-media/status
 * Update status for multiple media records
 * Body: { updates: [{ id: 1, status: 1 }, { id: 2, status: 0 }] }
 */
router.patch("/status", orderMediaPortalController.updateMediaStatus);

module.exports = router;
