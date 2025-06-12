const { Pool } = require("pg");
require("dotenv").config();
const invModel = {};

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
            `SELECT i.*, c.classification_name 
             FROM public.inventory AS i 
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

/* ***************************
 *  Get vehicle details by ID
 * ************************** */
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

/* ***************************
 *  Insert a new classification
 * ************************** */
async function insertClassification(classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *;";
        const result = await pool.query(sql, [classification_name]); // Fix: Changed db.query to pool.query
        return result.rowCount ? result.rows[0] : null;
    } catch (error) {
        console.error("Error inserting classification:", error);
        throw error; // Propagate the error for better debugging
    }
}


invModel.insertInventoryItem = async function (vehicleData) {
  const {
    classification_id, inv_make, inv_model, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
  } = vehicleData;

  try {
    const sql = `
      INSERT INTO inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    const result = await pool.query(sql, [
      classification_id, inv_make, inv_model, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Insert Inventory Error:", error);
    return null;
  }
};


module.exports = { 
  getInventoryByClassification, 
  getClassifications, 
  getVehicleById, 
  insertClassification, 
  insertInventoryItem: invModel.insertInventoryItem 
};
