const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const baseController = {};

baseController.buildHome = async function(req, res) {
    try {
        const nav = await utilities.getNav(); // Generate navigation using classifications
        res.render("index", { title: "Home", nav });
    } catch (error) {
        console.error("Error in buildHome:", error.message);
        res.status(500).send("An error occurred while building the home page.");
    }
};

module.exports = baseController;
