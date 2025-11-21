const jwt = require("jsonwebtoken");

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    // Get token from cookie
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({message: "No token provided"});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) {
            return res.status(403).json({message: "Invalid or expired token"});
        }

        req.user = user;
        next();
    });
}

module.exports = authenticateToken;