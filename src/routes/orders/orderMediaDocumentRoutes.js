const express = require("express");
const router = express.Router();
const orderMediaDocumentController = require("../../controllers/orders/orderMediaDocumentController");
const auth = require("../../middleware/auth");
const checkPermission = require("../../middleware/permission");
const activityLogger = require("../../middleware/activityLogger");

// Apply authentication middleware to all routes
router.use(auth);

// Upload document
router.post(
  "/upload",
  /* checkPermission("document.upload"), */
  activityLogger("order_media_documents", (req, res) => res.locals.documentId),
  orderMediaDocumentController.upload
);

// Get documents by order ID (more specific route first)
router.get(
  "/:orderId",
  /* checkPermission("document.view"), */
  orderMediaDocumentController.getCollagesByOrderId
);

// Delete document (soft delete)
router.delete(
  "/:id",
  /* checkPermission("document.delete"), */
  activityLogger("order_media_documents", (req) => req.params.id),
  orderMediaDocumentController.delete
);

module.exports = router;
