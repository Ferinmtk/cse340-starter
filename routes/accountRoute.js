//imports express and creates a new router object to handle the routes for the account controller and utility functions   
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")
const validate = require("../utilities/account-validation")

// Route to build account view 
router.get("/account", utilities.handleErrors(accountController.buildAccount))

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build register view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login request
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

// Route to build account management view
router.get("/", 
  // utilities.checkLogin, 
  utilities.handleErrors(accountController.buildAccountManagement)
)

// Update account routes
router.get("/update/:account_id", 
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountUpdate))

router.post("/update",
  utilities.checkLogin,
  validate.updateRules(),
  validate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount))

router.post("/update-password",
  utilities.checkLogin,
  validate.passwordRules(),
  validate.checkPassword,
  utilities.handleErrors(accountController.updatePassword))

// Process logout
router.get("/logout", utilities.handleErrors(accountController.logoutAccount))

// export the router object to be used in the main server.js file
module.exports = router;
