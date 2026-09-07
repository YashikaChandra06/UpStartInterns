const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');

const db = require('./db');
const { generateToken, authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ==========================================
// AUTHENTICATION ROUTES (/api/auth)
// ==========================================

// 1. POST /api/auth/register — Register new user with hashed password
app.post('/api/auth/register', (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || typeof username !== 'string' || !username.trim()) {
            return res.status(400).json({
                success: false,
                error: "Validation Error: 'username' is required."
            });
        }

        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return res.status(400).json({
                success: false,
                error: "Validation Error: Valid 'email' address is required."
            });
        }

        if (!password || typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({
                success: false,
                error: "Validation Error: 'password' must be at least 6 characters long."
            });
        }

        // Check if email already registered
        const existingUser = db.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "Registration Error: An account with this email already exists."
            });
        }

        // Hash password securely with bcryptjs (10 rounds)
        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync(password, salt);

        // Save user to SQLite database
        const newUser = db.createUser({
            username: username.trim(),
            email: email.trim(),
            passwordHash
        });

        // Issue JWT Token
        const token = generateToken(newUser);

        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Server Error: Unable to complete registration."
        });
    }
});

// 2. POST /api/auth/login — Login with email & password hash verification
app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Validation Error: Both 'email' and 'password' are required."
            });
        }

        const user = db.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: "Authentication Error: Invalid email or password."
            });
        }

        // Verify password against stored bcrypt hash
        const isMatch = bcrypt.compareSync(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: "Authentication Error: Invalid email or password."
            });
        }

        // Issue JWT Token
        const token = generateToken(user);

        res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Server Error: Unable to complete login."
        });
    }
});

// 3. GET /api/auth/me — Return current logged-in user profile
app.get('/api/auth/me', authenticateToken, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

// ==========================================
// USER-SCOPED DESTINATION ROUTES (/api/destinations)
// ==========================================

// 1. GET /api/destinations — List destinations for authenticated user
app.get('/api/destinations', authenticateToken, (req, res) => {
    try {
        const destinations = db.getAllDestinations(req.user.id);
        res.status(200).json({
            success: true,
            count: destinations.length,
            data: destinations
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Database Error: Unable to fetch user destinations."
        });
    }
});

// 2. GET /api/destinations/:id — Get single user-owned destination
app.get('/api/destinations/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;
        const destination = db.getDestinationById(id, req.user.id);

        if (!destination) {
            return res.status(404).json({
                success: false,
                error: `Destination with ID '${id}' not found in your account.`
            });
        }

        res.status(200).json({
            success: true,
            data: destination
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Database Error: Unable to fetch destination."
        });
    }
});

// 3. POST /api/destinations — Create new destination scoped to user
app.post('/api/destinations', authenticateToken, (req, res) => {
    try {
        const { name, tagline, description, image } = req.body;

        // Input Validation
        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({
                success: false,
                error: "Validation Error: 'name' is required and must be a non-empty string."
            });
        }

        if (name.trim().length < 2 || name.trim().length > 100) {
            return res.status(400).json({
                success: false,
                error: "Validation Error: 'name' must be between 2 and 100 characters."
            });
        }

        if (!description || typeof description !== 'string' || !description.trim()) {
            return res.status(400).json({
                success: false,
                error: "Validation Error: 'description' is required and must be a non-empty string."
            });
        }

        if (description.trim().length < 5) {
            return res.status(400).json({
                success: false,
                error: "Validation Error: 'description' must be at least 5 characters long."
            });
        }

        const newDestination = db.createDestination(req.user.id, {
            name: name.trim(),
            tagline: tagline ? tagline.trim() : "Scenic Destination",
            description: description.trim(),
            image: image && image.trim() ? image.trim() : null
        });

        res.status(201).json({
            success: true,
            message: "Destination created successfully.",
            data: newDestination
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Database Storage Error: Unable to insert destination."
        });
    }
});

// 4. PUT /api/destinations/:id — Update destination owned by user
app.put('/api/destinations/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;
        const existing = db.getDestinationById(id, req.user.id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                error: `Destination with ID '${id}' not found in your account.`
            });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                error: "Validation Error: Request body cannot be empty."
            });
        }

        const { name, tagline, description, image } = req.body;

        if (name !== undefined) {
            if (typeof name !== 'string' || !name.trim() || name.trim().length < 2) {
                return res.status(400).json({
                    success: false,
                    error: "Validation Error: 'name' must be a non-empty string with at least 2 characters."
                });
            }
        }

        if (description !== undefined) {
            if (typeof description !== 'string' || !description.trim() || description.trim().length < 5) {
                return res.status(400).json({
                    success: false,
                    error: "Validation Error: 'description' must be a non-empty string with at least 5 characters."
                });
            }
        }

        const updatedDestination = db.updateDestination(id, req.user.id, { name, tagline, description, image });

        res.status(200).json({
            success: true,
            message: `Destination updated successfully.`,
            data: updatedDestination
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Database Storage Error: Unable to update destination."
        });
    }
});

// 5. DELETE /api/destinations/:id — Delete destination owned by user
app.delete('/api/destinations/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;
        const existing = db.getDestinationById(id, req.user.id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                error: `Destination with ID '${id}' not found in your account.`
            });
        }

        const deletedItem = db.deleteDestination(id, req.user.id);

        res.status(200).json({
            success: true,
            message: `Destination '${deletedItem.name}' deleted successfully.`,
            data: { id: deletedItem.id, name: deletedItem.name }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Database Deletion Error: Unable to delete destination."
        });
    }
});

// Serve frontend SPA fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server (only if executed directly, not imported in serverless functions)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`====================================================`);
        console.log(` Explore India Authenticated Server running on port ${PORT}`);
        console.log(` Local Application URL: http://localhost:${PORT}`);
        console.log(` Database: SQLite (destinations.db)`);
        console.log(` Authentication: JWT + bcryptjs Password Hashing`);
        console.log(`====================================================`);
    });
}

module.exports = app;
