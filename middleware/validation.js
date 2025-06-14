// middleware/validation.js

const { body, validationResult } = require("express-validator");
const utilities = require("../utilities/index");
const accountModel = require("../models/account-model");

// Validation rules for registration
const registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required.")
      .custom(async (email) => {
        const existingEmail = await accountModel.checkExistingEmail(email);
        if (existingEmail) {
          throw new Error("Email exists. Please log in or use a different email.");
        }
      }),

    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password must be at least 12 characters and contain an uppercase letter, lowercase letter, number, and symbol."),
  ];
};

// Check for errors
const checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    res.render("account/register", {
      title: "Registration",
      nav,
      errors: errors.array(),
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};



const validateAccountUpdate = [
  body("account_firstname").trim().notEmpty().withMessage("First name is required."),
  body("account_lastname").trim().notEmpty().withMessage("Last name is required."),
  body("account_email").trim().isEmail().withMessage("Valid email required."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array().map(e => e.msg).join(", "));
      return res.redirect("/account/update");
    }
    next();
  },
];

const validatePasswordUpdate = [
  body("account_password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array().map(e => e.msg).join(", "));
      return res.redirect("/account/update");
    }
    next();
  },
];

module.exports = { 
  registrationRules, 
  checkRegData, 
  validateAccountUpdate, 
  validatePasswordUpdate 
};
