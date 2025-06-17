// account model for the account collection in the database 
const pool = require("../database/")


/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

// verify the user's email and password
async function verifyUser (email, password) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [email])
    if (result.rows.length > 0) {
      const user = result.rows[0]
      if (bcrypt.compareSync(password, user.account_password)) {
        return user
      }
    }
    return null
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Get account by id
* ***************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1',
      [account_id]
    )
    return result.rows[0]
  } catch (error) {
    return new Error("No matching account found")
  }
}

/* *****************************
* Update Account Info
* ***************************** */
async function updateAccount(account_firstname, account_lastname, account_email, account_id) {
  try {
    const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* *****************************
* Update Password
* ***************************** */
async function updatePassword(hashedPassword, account_id) {
  try {
    const sql = "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *"
    const data = await pool.query(sql, [hashedPassword, account_id])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* *****************************
* Check for existing email
* ***************************** */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rows[0]
  } catch (error) {
    return error.message
  }
}

module.exports = {
  registerAccount,
  getAccountByEmail,
  verifyUser,
  getAccountById,
  updateAccount,
  updatePassword,
  checkExistingEmail,
}

