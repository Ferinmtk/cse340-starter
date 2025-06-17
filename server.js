/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/


/* ***********************
 * Require Statements
 *************************/
const cookieParser = require("cookie-parser")
const session = require("express-session") // Session management
const pool = require('./database/') // Database connection
const utilities = require("./utilities/")
const baseController = require("./controllers/baseController")
const accountController = require("./controllers/accountController")
const bodyParser = require("body-parser")
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const path = require('path')
const app = express()
const reviewRoute = require("./routes/reviewRoute")
const reviewController = require("./controllers/reviewController")


/* ***********************
 * Middleware
 * ************************/
// Static Files - Must come before JWT check
app.use(express.static(path.join(__dirname, "public")))

// View Engine and Layouts
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

// Express Session
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'sessionId',
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}))

// Express Messages - Only need this once
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// JWT Check
app.use(cookieParser())
app.use(utilities.checkJWTToken)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) 

/* ***********************
 * Routes for the application 
 *************************/
app.use(require("./routes/static"))
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
// Inventory routes
app.use("/inv", require("./routes/inventoryRoute"))  

// Account routes
app.use("/account", require("./routes/accountRoute"))

//Vehicle Detail Route
app.get("/vehicle/:id", utilities.handleErrors(baseController.buildVehicleDetail)) 

// Review routes
app.use("/reviews", reviewRoute)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 5500
const host = process.env.HOST || 'localhost'

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  
  // Different error messages based on error type
  let message = 'Oh no! There was a crash. Maybe try a different route?'
  let title = 'Server Error'
  let status = 500

  if (err.status === 404) {
    message = err.message
    title = '404 - Page Not Found'
    status = 404
  } else if (err.name === 'Error' && err.message === 'This is an intentional error.') {
    message = 'This error was triggered intentionally for testing purposes.'
    title = 'Test Error'
    status = 500
  }

  res.status(status).render("errors/error", {
    title: title,
    message,
    nav
  })
})



