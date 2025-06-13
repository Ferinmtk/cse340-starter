const { body, validationResult } = require("express-validator")

// Registration validation rules
const registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),
    body("account_lastname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a last name."),
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required."),
    body("account_password")
      .trim()
      .isStrongPassword()
      .withMessage("Password must be at least 8 characters and include uppercase, lowercase, number, and symbol."),
  ]
}

// Login validation rules
const loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required."),
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ]
}

// Check for validation errors
const checkLoginData = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).render("account/login", {
      title: "Login",
      errors: errors.array(),
      account_email: req.body.account_email,
    })
  }
  next()
}

const checkRegData = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).render("account/register", {
      title: "Register",
      errors: errors.array(),
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email,
    })
  }
  next()
}

module.exports = {
  registrationRules,
  loginRules,
  checkLoginData,
  checkRegData,
}
