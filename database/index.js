const { Pool } = require("pg");
require("dotenv").config();

const isRender = process.env.DATABASE_URL?.includes("render.com");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...(isRender && {
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

console.log("Connecting to DB at:", process.env.DATABASE_URL);
