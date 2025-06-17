const utilities = require("../utilities/")
const reviewModel = require("../models/review-model")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  try {
    // Get the latest reviews
    const reviews = await reviewModel.getLatestReviews()
    res.render("index", {
      title: "Home", 
      nav,
      reviews
    })
  } catch (error) {
    console.error("Error in buildHome:", error)
    res.render("index", {
      title: "Home", 
      nav,
      reviews: []
    })
  }
}

module.exports = baseController