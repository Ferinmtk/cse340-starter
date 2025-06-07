const express = require("express");
const router = express.Router();
const errorController = require("../controllers/errorController");

// Route to trigger a 500 error intentionally
router.get("/trigger-error", errorController.throwError);

module.exports = router;
