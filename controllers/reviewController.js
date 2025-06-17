const reviewModel = require('../models/review-model')
const utilities = require('../utilities/')

const reviewCont = {}

/* ***************************
 *  Process new review
 * ************************** */
reviewCont.addReview = async function (req, res) {
  const { inv_id, review_text, rating } = req.body
  const account_id = res.locals.accountData.account_id

  try {
    const result = await reviewModel.addReview(
      inv_id,
      account_id,
      review_text,
      rating
    )

    if (result) {
      req.flash("notice", "Review added successfully!")
      res.redirect(`/inv/detail/${inv_id}`)
    } else {
      req.flash("notice", "Error adding review.")
      res.status(501).redirect(`/inv/detail/${inv_id}`)
    }
  } catch (error) {
    console.error("Error in addReview:", error)
    req.flash("notice", "Server error while adding review.")
    res.status(500).redirect(`/inv/detail/${inv_id}`)
  }
}

/* ***************************
 *  Build user reviews view
 * ************************** */
reviewCont.getUserReviews = async function (req, res) {
  try {
    const account_id = res.locals.accountData.account_id
    const reviews = await reviewModel.getReviewsByAccount(account_id)
    const nav = await utilities.getNav()
    
    res.render("./reviews/user-reviews", {
      title: "Your Reviews",
      nav,
      reviews,
      errors: null,
    })
  } catch (error) {
    console.error("getUserReviews error:", error)
    req.flash("notice", "Error getting reviews")
    res.redirect("/account/")
  }
}

/* ***************************
 *  Build edit review view
 * ************************** */
reviewCont.buildEditReview = async function (req, res) {
  const review_id = parseInt(req.params.reviewId)
  const review = await reviewModel.getReviewById(review_id)
  const nav = await utilities.getNav()
  
  // Check if review exists and belongs to user
  if (!review || review.account_id !== res.locals.accountData.account_id) {
    req.flash("notice", "You don't have permission to edit this review")
    return res.redirect("/reviews/user-reviews")
  }
  
  res.render("reviews/edit-review", {
    title: "Edit Review",
    nav,
    review,
    errors: null,
  })
}

/* ***************************
 *  Process review update
 * ************************** */
reviewCont.updateReview = async function (req, res) {
  const { review_id, review_text, rating } = req.body
  const review = await reviewModel.getReviewById(review_id)
  
  // Check if review exists and belongs to user
  if (!review || review.account_id !== res.locals.accountData.account_id) {
    req.flash("notice", "You don't have permission to edit this review")
    return res.redirect("/reviews/user-reviews")
  }
  
  try {
    const result = await reviewModel.updateReview(review_id, review_text, rating)
    if (result) {
      req.flash("notice", "Review updated successfully")
      res.redirect("/reviews/user-reviews")
    } else {
      req.flash("notice", "Error updating review")
      res.redirect(`/reviews/edit/${review_id}`)
    }
  } catch (error) {
    req.flash("notice", "Server error while updating review")
    res.redirect(`/reviews/edit/${review_id}`)
  }
}

/* ***************************
 *  Process review deletion
 * ************************** */
reviewCont.deleteReview = async function (req, res) {
  const review_id = parseInt(req.params.reviewId)
  const review = await reviewModel.getReviewById(review_id)
  
  // Check if review exists and belongs to user
  if (!review || review.account_id !== res.locals.accountData.account_id) {
    req.flash("notice", "You don't have permission to delete this review")
    return res.redirect("/reviews/user-reviews")
  }
  
  try {
    const result = await reviewModel.deleteReview(review_id)
    if (result) {
      req.flash("notice", "Review deleted successfully")
    } else {
      req.flash("notice", "Error deleting review")
    }
    res.redirect("/reviews/user-reviews")
  } catch (error) {
    req.flash("notice", "Server error while deleting review")
    res.redirect("/reviews/user-reviews")
  }
}

module.exports = reviewCont 