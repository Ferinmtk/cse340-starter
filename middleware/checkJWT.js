const jwt = require("jsonwebtoken");

function checkJWT(req, res, next) {
    const token = req.cookies.jwt;
    if (!token) {
        return res.redirect("/account/login?error=Unauthorized");
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.account = decoded;
        next();
    } catch (error) {
        return res.redirect("/account/login?error=Unauthorized");
    }
}

module.exports = checkJWT;
