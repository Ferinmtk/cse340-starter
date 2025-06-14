const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");

/* ****************************************
 *  Deliver registration view
 * **************************************** */
function buildRegister(req, res) {
  res.render("account/register", {
    title: "Register",
    nav: res.locals.nav || [],
    errors: null,
    success: req.flash("success"),
    error: req.flash("error"),
    message: req.flash("message"),
    account_firstname: "",
    account_lastname: "",
    account_email: ""
  });
}

/* ****************************************
 *  Deliver login view
 * **************************************** */
function buildLogin(req, res) {
  res.render("account/login", {
    title: "Login",
    nav: res.locals.nav || [],
    errors: null,
    success: req.flash("success"),
    error: req.flash("error"),
    message: req.flash("message")
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
    req.flash("message", "Please check your credentials and try again.");
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      success: [],
      error: [],
      message: req.flash("message")
    });
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });

      const cookieOptions = {
        httpOnly: true,
        maxAge: 3600000,
        ...(process.env.NODE_ENV !== "development" && { secure: false }),
      };

      res.cookie("jwt", accessToken, cookieOptions);
      return res.redirect("/accounts/");
    } else {
      req.flash("message", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        success: [],
        error: [],
        message: req.flash("message")
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    req.flash("message", "Something went wrong. Please try again.");
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      success: [],
      error: [],
      message: req.flash("message")
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
      return res.redirect("/accounts/login");
    } else {
      const error = ["Registration failed. Please try again."];
      return res.status(400).render("account/register", {
        title: "Register",
        nav,
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
      nav,
      error: errorMsg,
      success: [],
      account_firstname,
      account_lastname,
      account_email
    });
  }
}

/* ****************************************
 *  Account Management Page
 * **************************************** */
function getAccountManagement(req, res) {
  if (!req.account) {
    req.flash("error", "Unauthorized access");
    return res.redirect("/accounts/login");
  }
  res.render("account/manage", {
    title: "Account Management",
    nav: res.locals.nav,
    account: req.account,
    success: req.flash("success"),
    error: req.flash("error")
  });
}

/* ****************************************
 *  Account Update View
 * **************************************** */
function getAccountUpdateView(req, res) {
  if (!req.account) {
    req.flash("error", "Unauthorized");
    return res.redirect("/accounts/login");
  }
  res.render("account/update", {
    title: "Update Account",
    nav: res.locals.nav,
    account: req.account,
    errors: null,
    success: req.flash("success"),
    error: req.flash("error")
  });
}

/* ****************************************
 *  Update Account Info
 * **************************************** */
async function updateAccount(req, res) {
  const nav = await utilities.getNav();
  const { first_name, last_name, email, account_id } = req.body;

  if (!first_name || !last_name || !email) {
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors: ["All fields are required."],
      account: req.body
    });
  }

  try {
    const existingAccount = await accountModel.getAccountByEmail(email);
    if (existingAccount && existingAccount.account_id !== parseInt(account_id)) {
      return res.render("account/update", {
        title: "Update Account",
        nav,
        errors: ["Email already in use."],
        account: req.body
      });
    }

    await accountModel.updateAccountInfo(account_id, first_name, last_name, email);
    req.flash("success", "Account updated successfully.");
    return res.redirect("/accounts/manage");
  } catch (error) {
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors: ["An error occurred while updating the account."],
      account: req.body
    });
  }
}

/* ****************************************
 *  Update Password
 * **************************************** */
async function updatePassword(req, res) {
  const nav = await utilities.getNav();
  const { password, account_id } = req.body;

  if (!password || password.length < 8) {
    return res.render("account/update", {
      title: "Update Password",
      nav,
      errors: ["Password must be at least 8 characters long."],
      account: req.body
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await accountModel.updatePassword(account_id, hashedPassword);
    req.flash("success", "Password updated successfully.");
    return res.redirect("/accounts/manage");
  } catch (error) {
    return res.render("account/update", {
      title: "Update Password",
      nav,
      errors: ["An error occurred while updating the password."],
      account: req.body
    });
  }
}

/* ****************************************
 *  Logout
 * **************************************** */
function logout(req, res) {
  res.clearCookie("jwt");
  res.redirect("/?message=Logged out successfully");
}

module.exports = {
  buildLogin,
  buildRegister,
  accountLogin,
  registerAccount,
  getAccountManagement,
  getAccountUpdateView,
  updateAccount,
  updatePassword,
  logout
};
