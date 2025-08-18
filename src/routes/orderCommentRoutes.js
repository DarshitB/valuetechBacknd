const express = require("express");
const router = express.Router({ mergeParams: true });

const orderCommentController = require("../controllers/orderCommentController");
const auth = require("../middleware/auth"); // Middleware to check authentication

// Apply authentication middleware to all routes
router.use(auth);

// Get all comments for an order
router.get("/", orderCommentController.getByOrder);

// Add a new comment to an order
router.post("/", orderCommentController.create);

module.exports = router;
