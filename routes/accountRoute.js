// Required dependencies
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index");
const accountController = require("../controllers/accountController");

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));


// New registration route
router.get('/register', utilities.handleErrors(accountController.buildRegister));

// Export the router
module.exports = router;
