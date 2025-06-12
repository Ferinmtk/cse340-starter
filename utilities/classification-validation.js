const { body, validationResult } = require("express-validator")

const classificationRules = [
  body("classification_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Classification name is required.")
    .matches(/^[A-Za-z]+$/)
    .withMessage("Classification must contain only letters.")
]

const checkClassificationData = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash("error", errors.array()[0].msg)
    res.render("inventory/add-classification", {
      title: "Add Classification",
      errors: errors.array(),
    })
    return
  }
  next()
};

module.exports = {
  classificationRules,
  checkClassificationData,
};
