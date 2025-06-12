const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const invController = {};


/* ***************************
 *  Build Inventory by Classification View
 * ************************** */
invController.buildByClassificationId = async function (req, res) {
  try {
    const classificationId = req.params.classificationId;
    const inventoryData = await invModel.getInventoryByClassification(classificationId);
    const nav = await utilities.getNav();

    if (inventoryData.length === 0) {
      return res.status(404).render("no-inventory", { title: "No Inventory Found", nav });
    }

    const grid = utilities.buildClassificationGrid(inventoryData);
    res.render("inventory/classification", {
      title: "Inventory",
      nav,
      grid,
      inventory: inventoryData,
    });
  } catch (error) {
    console.error("Error building classification view:", error);
    const nav = await utilities.getNav();
    res.status(500).render("errors/error", { title: "Server Error", nav });
  }
};

/* ***************************
 *  Build Specific Vehicle Detail View
 * ************************** */
invController.buildDetailView = async function (req, res) {
  try {
    const invId = req.params.inventoryId;
    const vehicleData = await invModel.getVehicleById(invId);
    const nav = await utilities.getNav();

    if (!vehicleData) {
      return res.status(404).render("error", { title: "Vehicle Not Found", nav });
    }

    res.render("inventory/detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      vehicle: vehicleData,
    });
  } catch (error) {
    console.error("Error building vehicle detail view:", error);
    const nav = await utilities.getNav();
    res.status(500).render("errors/error", { title: "Server Error", nav });
  }
};

/* ***************************
 *  Show Inventory Management View
 * ************************** */
invController.showManagement = async function (req, res) {
  try {
    const nav = await utilities.getNav();
    const message = req.flash("message");
    const success = req.flash("success");
    const error = req.flash("error");

    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      message,
      success,
      error,
    });
  } catch (error) {
    console.error("Error showing management view:", error);
    const nav = await utilities.getNav();
    res.status(500).render("error", { title: "Server Error", nav });
  }
};

/* ***************************
 *  Show Add Classification Form
 * ************************** */
invController.buildAddClassification = async function (req, res) {
  try {
    const nav = await utilities.getNav();
    const success = req.flash("success");
    const error = req.flash("error");

    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      error,
      success,
      classification_name: "",
    });
  } catch (error) {
    console.error("Error showing add-classification form:", error);
    const nav = await utilities.getNav();
    res.status(500).render("error", { title: "Server Error", nav });
  }
};

/* ***************************
 *  Handle New Classification Submission
 * ************************** */
invController.addClassification = async function (req, res) {
  try {
    const { classification_name } = req.body;
    const nav = await utilities.getNav();
    const trimmedName = classification_name?.trim() || "";
    const regex = /^[A-Za-z\s]{1,30}$/;

    if (!trimmedName || !regex.test(trimmedName)) {
      const error = ["Classification name must be 1–30 characters, letters and spaces only."];
      return res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        error,
        success: [],
        classification_name: trimmedName,
      });
    }

    const result = await invModel.insertClassification(trimmedName);

    if (result) {
      req.flash("success", "Classification added successfully!");
      return res.redirect("/inv/management");
    } else {
      const error = ["Failed to add classification."];
      return res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        error,
        success: [],
        classification_name: trimmedName,
      });
    }
  } catch (error) {
    console.error("Error adding classification:", error);
    const nav = await utilities.getNav();
    return res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      error: ["An unexpected error occurred."],
      success: [],
      classification_name: req.body.classification_name || "",
    });
  }
};

/* ***************************
 *  Show Add Inventory Form
 * ************************** */
invController.buildAddInventory = async function (req, res) {
  try {
    const nav = await utilities.getNav();
    const classifications = await invModel.getClassifications(); // ✅ get array
    res.render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classifications, // ✅ pass raw array to EJS
      success: req.flash("success"),
      error: req.flash("error"),
    });
  } catch (error) {
    console.error("Error building add-inventory view:", error);
    const nav = await utilities.getNav();
    res.status(500).render("errors/error", { title: "Server Error", nav });
  }
};

/* ***************************
 *  Handle New Inventory Submission
 * ************************** */
invController.addInventory = async function (req, res) {
  const nav = await utilities.getNav();
  const classifications = await invModel.getClassifications(); // ✅

  try {
    const {
      classification_id, inv_make, inv_model, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
    } = req.body;

    if (
      !classification_id || !inv_make || !inv_model || !inv_description ||
      !inv_image || !inv_thumbnail || !inv_price || !inv_year || !inv_miles || !inv_color
    ) {
      req.flash("error", "All fields are required.");
      return res.render("inventory/add-inventory", {
        title: "Add Vehicle",
        nav,
        classifications,
        error: req.flash("error"),
        ...req.body,
      });
    }

    const result = await invModel.insertInventoryItem({
      classification_id, inv_make, inv_model, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
    });

    if (result) {
      req.flash("success", "Vehicle added successfully!");
      return res.redirect("/inv/management");
    } else {
      req.flash("error", "Failed to add vehicle.");
      return res.render("inventory/add-inventory", {
        title: "Add Vehicle",
        nav,
        classifications,
        error: req.flash("error"),
        ...req.body,
      });
    }
  } catch (error) {
    console.error("Error adding inventory item:", error);
    req.flash("error", "An unexpected error occurred.");
    return res.render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classifications,
      error: req.flash("error"),
      ...req.body,
    });
  }
};


invController.buildManagementView = async function (req, res) {
  try {
    const nav = await utilities.getNav();
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      success: req.flash("success"),
      error: req.flash("error")
    });
  } catch (error) {
    console.error("Error loading inventory management view:", error);
    res.status(500).render("errors/error", {
      title: "Server Error",
      nav: await utilities.getNav()
    });
  }
};


module.exports = invController;
