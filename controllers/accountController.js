const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");



/* ****************************************
 *  Deliver registration view
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

/* ****************************************
 *  Deliver login view
 * **************************************** */

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
      return res.redirect("/account/login"); // ✅ ensure return
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
      }); // ✅ ensure return
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
    }); // ✅ ensure return
  }
}


function getAccountManagement(req, res) {
    if (!req.account) {
        return res.redirect("/accounts/login");
    }
    res.render("account/manage", { account: req.account });
}


function getAccountUpdateView(req, res) {
    if (!req.account) return res.redirect("/accounts/login");
    res.render("account/update", { account: req.account });
}

function updateAccount(req, res) {
    const { first_name, last_name, email, account_id } = req.body;
    if (!first_name || !last_name || !email) {
        return res.render("account/update", { errors: "All fields are required.", account: req.body });
    }
    // Perform database update logic
}

function updatePassword(req, res) {
    const { password, account_id } = req.body;
    if (password.length < 8) {
        return res.render("account/update", { errors: "Password must be at least 8 characters.", account: req.body });
    }
    // Perform password hashing and database update
}





function getAccountUpdateView(req, res) {
    if (!req.account) return res.redirect("/accounts/login");
    res.render("account/update", { account: req.account });
}

async function updateAccount(req, res) {
    const { first_name, last_name, email, account_id } = req.body;
    if (!first_name || !last_name || !email) {
        return res.render("account/update", { errors: "All fields are required.", account: req.body });
    }

    try {
        const existingAccount = await accountModel.getAccountByEmail(email);
        if (existingAccount && existingAccount.id !== account_id) {
            return res.render("account/update", { errors: "Email already in use.", account: req.body });
        }

        await accountModel.updateAccountInfo(account_id, first_name, last_name, email);
        res.redirect("/accounts/manage?success=Account updated successfully");
    } catch (error) {
        res.render("account/update", { errors: "An error occurred.", account: req.body });
    }
}

const bcrypt = require("bcrypt");

async function updatePassword(req, res) {
    const { password, account_id } = req.body;
    if (password.length < 8) {
        return res.render("account/update", { errors: "Password must be at least 8 characters.", account: req.body });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await accountModel.updatePassword(account_id, hashedPassword);
        res.redirect("/accounts/manage?success=Password updated successfully");
    } catch (error) {
        res.render("account/update", { errors: "An error occurred.", account: req.body });
    }
}


function logout(req, res) {
    res.clearCookie("jwt");  // Remove the authentication token
    res.redirect("/?message=Logged out successfully");
}

module.exports = { buildLogin, buildRegister, accountLogin, registerAccount };
