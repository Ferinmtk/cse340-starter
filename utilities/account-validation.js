const { body, validationResult } = require("express-validator")
const utilities = require(".")
const accountModel = require("../models/account-model")

const accountValidation = {}

/* ****************************************
* Login Data Validation Rules
**************************************** */
accountValidation.loginRules = () => {
    return [
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required."),
        
        body("account_password")
            .trim()
            .isLength({ min: 12 })
            .withMessage("Password must be at least 12 characters long.")
    ]
}

/* ****************************************
* Registration Data Validation Rules
**************************************** */
accountValidation.registationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."),

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."),

        // valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required."),

        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/* ****************************************
* Check data and return errors or continue to registration
**************************************** */
accountValidation.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/* ****************************************
* Check login data and return errors or continue
**************************************** */
accountValidation.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
        })
        return
    }
    next()
}

/* ************************
 * Account Update Data Validation Rules
 ************************** */
accountValidation.updateRules = () => {
    return [
        body("account_firstname")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."),

        body("account_lastname")
            .trim()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."),

        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required.")
            .custom(async (account_email, { req }) => {
                const account_id = req.body.account_id
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists && emailExists.account_id != account_id) {
                    throw new Error("Email exists. Please use a different email")
                }
            }),
    ]
}

/* ************************
 * Password Update Validation Rules
 ************************** */
accountValidation.passwordRules = () => {
    return [
        body("account_password")
            .trim()
            .isLength({ min: 12 })
            .withMessage("Password must be at least 12 characters")
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/)
            .withMessage(
                "Password must contain at least 1 number, 1 capital letter, and 1 special character"
            ),
    ]
}

/* ************************
 * Check data and return errors or continue to update
 ************************** */
accountValidation.checkUpdateData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
            errors,
            title: "Edit Account",
            nav,
            account_firstname,
            account_lastname,
            account_email,
            account_id,
        })
        return
    }
    next()
}

/* ************************
 * Check password data and return errors or continue to update
 ************************** */
accountValidation.checkPassword = async (req, res, next) => {
    const { account_password, account_id } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
            errors,
            title: "Edit Account",
            nav,
            account_id,
        })
        return
    }
    next()
}

module.exports = accountValidation 