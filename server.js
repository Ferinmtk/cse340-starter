/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();
const app = express();

const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities/index");

/* ***********************
 * Express Configuration
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");
app.use(express.static("public"));

/* ***********************
 * Route Definitions
 *************************/
app.get("/", baseController.buildHome);
app.use("/inv", inventoryRoute);
app.use(static);

/* ***********************
 * Error Handling Middleware
 *************************/
app.use(async (err, req, res, next) => {
    console.error(`Error: ${err.message}`);
    const nav = await utilities.getNav();
    res.status(err.status || 500).render("error", {
        title: "Application Error",
        message: err.message || "Something went wrong!",
        nav,
    });
});

/* ***********************
 * Server Activation
 *************************/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
});
