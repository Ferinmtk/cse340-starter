const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");


/* ****************************************
 *  Deliver login view
 * **************************************** */
function buildRegister(req, res, next) {
  res.render("account/register", {
    title: "Register",
    nav: res.locals.nav || [],
    errors: null,
    success: req.flash("success"),
    error: req.flash("error"),
    account_firstname: "",
    account_lastname: "",
    account_email: ""
  });
}

function buildLogin(req, res, next) {
  res.render("account/login", {
    title: "Login",
    nav: res.locals.nav || [],
    errors: null,
    message: req.flash("message"),
    success: req.flash("success"),
    error: req.flash("error"),
  });
}

/* ****************************************
 *  Deliver registration view
 * **************************************** */
function buildRegister(req, res, next) {
  const nav =  utilities.getNav(); // Fetch navigation
  res.render("account/register", {
    title: "Register",
    nav, // Pass navigation explicitly
    errors: null,
    success: req.flash("success"),
    error: req.flash("error"),
    account_firstname: "",
    account_lastname: "",
    account_email: ""
  });
}


/* ****************************************
 *  Process account login
 * **************************************** */
async function accountLogin(req, res) {
  const nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });

      const cookieOptions = {
        httpOnly: true,
        maxAge: 3600000,
        ...(process.env.NODE_ENV !== "development" && { secure: true }),
      };

      res.cookie("jwt", accessToken, cookieOptions);
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    req.flash("notice", "Something went wrong. Please try again.");
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }
}

/* ****************************************
 *  Process registration
 * **************************************** */
async function registerAccount(req, res) {
  const nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const result = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (result) {
      req.flash("success", "Account successfully registered. Please log in.");
      return res.redirect("/account/login");
    } else {
      const error = ["Registration failed. Please try again."];
      return res.status(400).render("account/register", {
        title: "Register",
        nav: res.locals.nav || [],
        error,
        success: [],
        account_firstname,
        account_lastname,
        account_email
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    const errorMsg = ["A server error occurred. Please try again later."];
    return res.status(500).render("account/register", {
      title: "Register",
      nav: res.locals.nav || [],
      error: errorMsg,
      success: [],
      account_firstname,
      account_lastname,
      account_email
    });
  }
}

module.exports = { buildLogin, buildRegister, accountLogin, registerAccount };
