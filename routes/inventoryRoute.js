// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController"); 
const utilities = require("../utilities/");
const classValidate = require("../utilities/classification-validation");

// Route to Management View
router.get("/management", utilities.handleErrors(invController.buildManagementView));

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build a specific vehicle detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildDetailView));

// Show add-classification form
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Handle new classification submission
router.post(
  "/add-classification",
  ...(Array.isArray(classValidate.classificationRules) ? classValidate.classificationRules : [classValidate.classificationRules]),
  classValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Show add-inventory form
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Handle new inventory submission
router.post("/add-inventory", utilities.handleErrors(invController.addInventory));

// Default route to redirect to management page (optional, if you want `/inv/` to go to management)
router.get("/", (req, res) => res.redirect("/inv/management"));

module.exports = router;
