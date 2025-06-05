const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

/* ***************************
 *  Get all inventory items by classification ID
 * ************************** */
async function getInventoryByClassification(classification_id) {
    try {
        const data = await pool.query(
            `SELECT i.*, c.classification_name FROM public.inventory AS i 
             JOIN public.classification AS c 
             ON i.classification_id = c.classification_id 
             WHERE i.classification_id = $1`,
            [classification_id]
        );
        return data.rows;
    } catch (error) {
        console.error("Error in getInventoryByClassification:", error);
        throw error;
    }
}

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    try {
        const data = await pool.query(
            "SELECT * FROM public.classification ORDER BY classification_name"
        );
        return data.rows;
    } catch (error) {
        console.error("Error in getClassifications:", error);
        throw error;
    }
}

module.exports = { getClassifications, getInventoryByClassification };

