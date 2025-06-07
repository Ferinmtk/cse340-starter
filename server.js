/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities/index");




app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root
app.use(express.static("public"));


//index route
app.get("/", baseController.buildHome);
app.use("/inv", inventoryRoute);
app.use(express.static("public"));





app.use(static)

// Error Handling Middleware
// Error Handling Middleware
app.use(async (err, req, res, next) => {
    console.error(`Error: ${err.message}`); // Logs error details

    const nav = await utilities.getNav(); // ✅ Ensure it's properly awaited
    res.status(err.status || 500).render("error", {
        title: "Application Error",
        message: err.message || "Something went wrong!",
        nav,
    });
});



/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
