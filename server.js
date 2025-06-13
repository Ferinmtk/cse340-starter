/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const cookieParser = require("cookie-parser")
const session = require("express-session")
const pool = require('./database/')

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities/index");
const accountRoute = require("./routes/accountRoute");
const flash = require("connect-flash");






/* ***********************
 * Middleware
 * ************************/
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}));



// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
});
app.use(cookieParser())



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
app.use("/account", accountRoute);
app.use(flash());

/* ***********************
 * Error Handling Middleware
 *************************/
app.use(async (err, req, res, next) => {
    console.error(`Error: ${err.message}`);
    const nav = await utilities.getNav();
    res.status(err.status || 500).render("errors/error", {
        title: "Application Error",
        message: err.message || "Something went wrong!",
        nav,
    });
});



/* ***********************
 * Server Activation
 *************************/
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
});
