// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController"); 
const utilities = require("../utilities/");
const classValidate = require("../utilities/classification-validation");
const authorizeInventory = require("../middleware/authorizeInventory");


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

router.use("/edit", authorizeInventory);
router.use("/delete", authorizeInventory);

module.exports = router;
