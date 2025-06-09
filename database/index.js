const { Pool } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...(isProduction && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
});

module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params);
      console.log("Executed query:", text);
      return res;
    } catch (error) {
      console.error("Error in query:", text, error);
      throw error;
    }
  },
};
