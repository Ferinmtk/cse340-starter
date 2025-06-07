const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const invController = {};

invController.buildByClassificationId = async function(req, res) {
    const classificationId = req.params.classificationId; // Get classification ID
    const inventoryData = await invModel.getInventoryByClassification(classificationId); // Query DB
    const nav = await utilities.getNav(); // Generate navigation

    if (inventoryData.length === 0) {
        res.status(404).render("no-inventory", { title: "No Inventory Found", nav });
        return;
    }

    const grid = utilities.buildClassificationGrid(inventoryData); // Generate vehicle display grid

    res.render("inventory/classification", { 
        title: "Inventory", 
        nav, 
        grid,
        inventory: inventoryData 
    });

};

invController.buildDetailView = async function(req, res) {
    const invId = req.params.inventoryId; // Get inventory ID from URL
    const vehicleData = await invModel.getVehicleById(invId); // Fetch vehicle details
    const nav = await utilities.getNav(); // Generate navigation

    if (!vehicleData) {
        res.status(404).render("error", { title: "Vehicle Not Found", nav });
        return;
    }

    res.render("inventory/detail", { 
        title: `${vehicleData.inv_make} ${vehicleData.inv_model}`, 
        nav, 
        vehicle: vehicleData // ✅ Ensures 'vehicle' is passed to 'detail.ejs'
    });
};

module.exports = invController;
