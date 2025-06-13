const pool = require("../database/");

/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_password FROM account WHERE account_email = $1",
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("No matching email found");
  }
}

/* *****************************
 * Register a new account
 * ***************************** */
async function registerAccount(firstname, lastname, email, hashedPassword) {
  try {
    const sql = `
      INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const data = await pool.query(sql, [firstname, lastname, email, hashedPassword]);
    return data.rows[0];
  } catch (error) {
    console.error("Database error during registerAccount:", error);
    throw new Error("Database registration failed: " + error.message);
  }
}


async function getAccountById(account_id) {
    const result = await db.query("SELECT * FROM accounts WHERE id = ?", [account_id]);
    return result[0];
}



async function updateAccountInfo(account_id, first_name, last_name, email) {
    await db.query("UPDATE accounts SET first_name = ?, last_name = ?, email = ? WHERE id = ?", 
                   [first_name, last_name, email, account_id]);
}


async function updatePassword(account_id, hashedPassword) {
    await db.query("UPDATE accounts SET password = ? WHERE id = ?", [hashedPassword, account_id]);
}

module.exports = {
  getAccountByEmail,
  registerAccount,
};
