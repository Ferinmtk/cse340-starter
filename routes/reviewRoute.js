const express = require("express")
const router = new express.Router()
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities/")
const validate = require("../utilities/review-validation")

// Get user's reviews
router.get(
  "/user-reviews",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.getUserReviews)
)

// Get edit review view
router.get(
  "/edit/:reviewId",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildEditReview)
)

// Process review update
router.post(
  "/update",
  utilities.checkLogin,
  validate.reviewRules(),
  validate.checkReviewData,
  utilities.handleErrors(reviewController.updateReview)
)

// Process the review
router.post(
  "/add-review",
  utilities.checkLogin,
  validate.reviewRules(),
  validate.checkReviewData,
  utilities.handleErrors(reviewController.addReview)
)

// Process review deletion
router.get(
  "/delete/:reviewId",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.deleteReview)
)

module.exports = router 