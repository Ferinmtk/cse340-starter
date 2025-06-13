function authorizeInventory(req, res, next) {
    if (!req.account || !["Employee", "Admin"].includes(req.account.type)) {
        return res.redirect("/accounts/login?error=Unauthorized");
    }
    next();
}
module.exports = authorizeInventory;
rs
