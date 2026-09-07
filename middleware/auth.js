const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'explore_india_super_secret_jwt_key_2026';

function generateToken(user) {
    return jwt.sign(
        { id: String(user.id), email: user.email, username: user.username },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            error: "Authentication Error: Access token required. Please sign in."
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                error: "Authentication Error: Invalid or expired token. Please sign in again."
            });
        }
        req.user = user;
        next();
    });
}

// Optional Auth Middleware (attaches user if token present, but doesn't block if absent)
function optionalAuthenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        req.user = null;
        return next();
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (!err) {
            req.user = user;
        } else {
            req.user = null;
        }
        next();
    });
}

module.exports = {
    JWT_SECRET,
    generateToken,
    authenticateToken,
    optionalAuthenticateToken
};
