// Required dependencies
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index");
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation');
const { validateAccountUpdate, validatePasswordUpdate } = require("../middleware/validation");


// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)


// New registration route
router.get('/register', utilities.handleErrors(accountController.buildRegister));

router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Home page of account section 
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.getAccountManagement));

// Logout route

router.get("/manage", accountController.getAccountManagement);
router.get("/update", accountController.getAccountUpdateView);
router.post("/update", validateAccountUpdate, accountController.updateAccount);
router.post("/update-password", validatePasswordUpdate, accountController.updatePassword);

router.get("/logout", accountController.logout);

// Export the router
module.exports = router;
