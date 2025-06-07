/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config(); // Ensure environment variables are loaded
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities/index");

/* ***********************
 * Middleware & Configuration
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // Not at views root
app.use(express.static("public"));

/* ***********************
 * Routes
 *************************/
app.get("/", baseController.buildHome);
app.use("/inv", inventoryRoute);
app.use(static);

/* ***********************
 * Error Handling Middleware
 *************************/
app.use(async (err, req, res, next) => {
    console.error(`Error: ${err.message}`);

    try {
        const nav = await utilities.getNav(); // ✅ Ensure it’s awaited properly
        console.log("Navigation Data:", nav); // Debugging step
        res.status(err.status || 500).render("error", {
            title: "Application Error",
            message: err.message || "Something went wrong!",
            nav,
        });
    } catch (navError) {
        console.error("Error fetching navigation:", navError);
        res.status(500).send("Critical error loading navigation.");
    }
});

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 3000; // Default to 3000 if undefined
const host = process.env.HOST || "localhost"; // Default to localhost

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
    console.log(`App listening on ${host}:${port}`);
});
