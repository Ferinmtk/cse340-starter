// middleware/authorizeInventory.js

function authorizeInventory(req, res, next) {
  // Ensure accountData exists before checking account_type
  const accountType = res.locals.account?.account_type;

  if (accountType && (accountType === "Admin" || accountType === "Employee")) {
    return next();
  } else {
    req.flash("notice", "Access denied: Admin or Employee rights required.");
    return res.redirect("/account/login"); // Corrected URL path for consistency
  }
}

module.exports = authorizeInventory;
