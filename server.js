const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ==========================================
// REST API ROUTES (/api/destinations)
// ==========================================

// 1. GET /api/destinations — List all destinations from SQLite DB
app.get('/api/destinations', (req, res) => {
    try {
        const destinations = db.getAllDestinations();
        res.status(200).json({
            success: true,
            count: destinations.length,
            data: destinations
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Database Query Error: Unable to fetch destinations."
        });
    }
});

// 2. GET /api/destinations/:id — Get single destination by ID from SQLite DB
app.get('/api/destinations/:id', (req, res) => {
    try {
        const { id } = req.params;
        const destination = db.getDestinationById(id);

        if (!destination) {
            return res.status(404).json({
                success: false,
                error: `Destination with ID '${id}' not found.`
            });
        }

        res.status(200).json({
            success: true,
            data: destination
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Database Query Error: Unable to fetch destination."
        });
    }
});

// 3. POST /api/destinations — Validate input & insert into SQLite DB
app.post('/api/destinations', (req, res) => {
    try {
        const { name, tagline, description, image } = req.body;

        // STRICT INPUT VALIDATION BEFORE DB STORAGE
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

        // Create record in database
        const newDestination = db.createDestination({
            name: name.trim(),
            tagline: tagline ? tagline.trim() : "Scenic Destination",
            description: description.trim(),
            image: image && image.trim() ? image.trim() : null
        });

        res.status(201).json({
            success: true,
            message: "Destination created successfully in database.",
            data: newDestination
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Database Storage Error: Unable to insert destination."
        });
    }
});

// 4. PUT /api/destinations/:id — Validate input & update record in SQLite DB
app.put('/api/destinations/:id', (req, res) => {
    try {
        const { id } = req.params;
        const existing = db.getDestinationById(id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                error: `Destination with ID '${id}' not found.`
            });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                error: "Validation Error: Request body cannot be empty."
            });
        }

        const { name, tagline, description, image } = req.body;

        // Validation if fields provided
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

        const updatedDestination = db.updateDestination(id, { name, tagline, description, image });

        res.status(200).json({
            success: true,
            message: `Destination with ID '${id}' updated successfully in database.`,
            data: updatedDestination
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Database Storage Error: Unable to update destination."
        });
    }
});

// 5. DELETE /api/destinations/:id — Delete record from SQLite DB
app.delete('/api/destinations/:id', (req, res) => {
    try {
        const { id } = req.params;
        const existing = db.getDestinationById(id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                error: `Destination with ID '${id}' not found.`
            });
        }

        const deletedItem = db.deleteDestination(id);

        res.status(200).json({
            success: true,
            message: `Destination '${deletedItem.name}' (ID: ${id}) deleted successfully from database.`,
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

// Start Server
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` Explore India SQLite API Server running on port ${PORT}`);
    console.log(` Local Application URL: http://localhost:${PORT}`);
    console.log(` Database: SQLite (destinations.db)`);
    console.log(`====================================================`);
});
