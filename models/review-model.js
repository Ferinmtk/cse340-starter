const pool = require('../database/')

const reviewModel = {}

/* ***************************
 *  Get reviews by vehicle ID
 * ************************** */
reviewModel.getReviewsByVehicle = async function(inv_id) {
  try {
    const sql = `
      SELECT r.*, a.account_firstname, a.account_lastname 
      FROM public.reviews r
      JOIN public.account a ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.review_date DESC`
    const result = await pool.query(sql, [inv_id])
    return result.rows
  } catch (error) {
    console.error("getReviewsByVehicle error: " + error)
    throw error
  }
}

/* ***************************
 *  Add new review
 * ************************** */
reviewModel.addReview = async function(inv_id, account_id, review_text, rating) {
  try {
    const sql = `
      INSERT INTO public.reviews (inv_id, account_id, review_text, rating)
      VALUES ($1, $2, $3, $4)
      RETURNING *`
    const result = await pool.query(sql, [inv_id, account_id, review_text, rating])
    return result.rows[0]
  } catch (error) {
    console.error("addReview error: " + error)
    throw error
  }
}

/* ***************************
 *  Get reviews by account ID
 * ************************** */
reviewModel.getReviewsByAccount = async function(account_id) {
  try {
    const sql = `
      SELECT r.*, i.inv_make, i.inv_model, i.inv_year 
      FROM public.reviews r
      JOIN public.inventory i ON r.inv_id = i.inv_id
      WHERE r.account_id = $1
      ORDER BY r.review_date DESC`
    console.log("Executing query with account_id:", account_id) // Debug log
    const result = await pool.query(sql, [account_id])
    console.log("Query result:", result.rows) // Debug log
    return result.rows
  } catch (error) {
    console.error("getReviewsByAccount error: " + error)
    throw error
  }
}

/* ***************************
 *  Get review by ID
 * ************************** */
reviewModel.getReviewById = async function(review_id) {
  try {
    const sql = `
      SELECT r.*, i.inv_make, i.inv_model, i.inv_year 
      FROM public.reviews r
      JOIN public.inventory i ON r.inv_id = i.inv_id
      WHERE r.review_id = $1`
    const result = await pool.query(sql, [review_id])
    return result.rows[0]
  } catch (error) {
    console.error("getReviewById error: " + error)
    throw error
  }
}

/* ***************************
 *  Update review
 * ************************** */
reviewModel.updateReview = async function(review_id, review_text, rating) {
  try {
    const sql = `
      UPDATE public.reviews
      SET review_text = $1, rating = $2
      WHERE review_id = $3
      RETURNING *`
    const result = await pool.query(sql, [review_text, rating, review_id])
    return result.rows[0]
  } catch (error) {
    console.error("updateReview error: " + error)
    throw error
  }
}

/* ***************************
 *  Delete review
 * ************************** */
reviewModel.deleteReview = async function(review_id) {
  try {
    const sql = `
      DELETE FROM public.reviews
      WHERE review_id = $1
      RETURNING *`
    const result = await pool.query(sql, [review_id])
    return result.rows[0]
  } catch (error) {
    console.error("deleteReview error: " + error)
    throw error
  }
}

/* ***************************
 * Get latest reviews for homepage
 * ************************** */
reviewModel.getLatestReviews = async function() {
  try {
    const sql = `
      SELECT r.*, a.account_firstname, a.account_lastname, 
             i.inv_make, i.inv_model, i.inv_year
      FROM public.reviews r
      JOIN public.account a ON r.account_id = a.account_id
      JOIN public.inventory i ON r.inv_id = i.inv_id
      ORDER BY r.review_date DESC
      LIMIT 4
    `
    const result = await pool.query(sql)
    return result.rows
  } catch (error) {
    console.error("getLatestReviews error: " + error)
    return []
  }
}

module.exports = reviewModel 