const { body, validationResult } = require("express-validator")
const utilities = require(".")
const validate = {}

/* ****************************************
 * Review Data Validation Rules
 **************************************** */
validate.reviewRules = () => {
  return [
    body("review_text")
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage("Review must be between 10 and 1000 characters."),
    
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5 stars.")
  ]
}

/* ****************************************
 * Check review data and return errors
 **************************************** */
validate.checkReviewData = async (req, res, next) => {
  const { review_text, rating } = req.body
  let errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("reviews/edit-review", {
      errors,
      title: "Edit Review",
      nav,
      review: { review_text, rating: parseInt(rating) }
    })
    return
  }
  next()
}

module.exports = validate 