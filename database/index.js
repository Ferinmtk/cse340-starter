const { Pool } = require("pg")
require("dotenv").config()

/* ***************
 * Connection Pool
 * SSL Object needed for both local testing and production
 * *************** */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

// Added for troubleshooting queries
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params)
      console.log("executed query", { text })
      return res
    } catch (error) {
      console.error("error in query", { text })
      throw error
    }
  },
}