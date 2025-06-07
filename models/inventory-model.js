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

async function getVehicleById(invId) {
    try {
        const data = await pool.query(
            "SELECT inv_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_image, inv_thumbnail FROM public.inventory WHERE inv_id = $1",
            [invId]
        );

        if (data.rowCount === 0) {
            throw new Error("No vehicle found with ID " + invId);
        }

        return data.rows[0]; 
    } catch (error) {
        console.error("Database Error:", error);
        throw error; // Ensures the error gets caught by the controller
    }
}


module.exports = { getVehicleById, getClassifications, getInventoryByClassification };

