const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');
const os = require('os');
const bcrypt = require('bcryptjs');

let dbPath = path.join(__dirname, 'destinations.db');

// On serverless platforms like Vercel, the source directory is read-only.
// Use os.tmpdir() to store writeable SQLite database.
if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDbPath = path.join(os.tmpdir(), 'destinations.db');
    if (!fs.existsSync(tmpDbPath)) {
        if (fs.existsSync(dbPath)) {
            try {
                fs.copyFileSync(dbPath, tmpDbPath);
                console.log('[DB] Copied default destinations.db to tmp directory for Vercel execution.');
            } catch (err) {
                console.warn('[DB] Could not copy seed db file to tmp, initializing fresh db:', err.message);
            }
        }
    }
    dbPath = tmpDbPath;
}

const db = new DatabaseSync(dbPath);

// Initialize Database Schema
function initDatabase() {
    // 1. Create users table
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // 2. Create user-scoped destinations table
    db.exec(`
        CREATE TABLE IF NOT EXISTS destinations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            tagline TEXT,
            description TEXT NOT NULL,
            image TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    // 3. Seed Demo Account if empty
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
    if (userCount.count === 0) {
        console.log('[DB] Seeding default Demo User (demo@example.com / password123)...');
        const salt = bcrypt.genSaltSync(10);
        const demoHash = bcrypt.hashSync('password123', salt);

        const insertUser = db.prepare(`
            INSERT INTO users (username, email, password_hash)
            VALUES (?, ?, ?)
        `);
        const result = insertUser.run('Demo Traveler', 'demo@example.com', demoHash);
        const demoUserId = result.lastInsertRowid;

        // Seed initial destinations for Demo User
        const insertDest = db.prepare(`
            INSERT INTO destinations (user_id, name, tagline, description, image)
            VALUES (?, ?, ?, ?, ?)
        `);

        const seedData = [
            [demoUserId, "Himachal Pradesh", "Mountain Paradise", "Explore quiet mountain towns, scenic valleys, pine forests and breathtaking Himalayan views.", "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80"],
            [demoUserId, "Goa", "Coastal Sunshine", "Relax beside the Arabian Sea, enjoy local food and experience Goa's vibrant coastal culture.", "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"],
            [demoUserId, "Agra", "Historic Splendor", "Visit the Taj Mahal and discover the rich Mughal history and architecture of the city.", "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80"],
            [demoUserId, "Kerala", "God's Own Country", "Experience tranquil backwaters, palm-fringed beaches, tea plantations, and rich Ayurveda heritage.", "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80"],
            [demoUserId, "Jaipur, Rajasthan", "The Pink City", "Discover grand royal palaces, historic hilltop forts, vibrant bazaars, and rich Rajasthani culture.", "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80"],
            [demoUserId, "Varanasi", "Spiritual Heart of India", "Witness timeless spiritual traditions, ancient ghats along the sacred Ganges river, and evening Aarti ceremonies.", "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80"],
            [demoUserId, "Ladakh", "Land of High Passes", "Explore dramatic high-altitude desert landscapes, crystal-clear alpine lakes, and ancient Buddhist monasteries.", "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80"],
            [demoUserId, "Amritsar, Punjab", "The Golden City", "Visit the revered Golden Temple, experience rich Sikh heritage, vibrant culture, and legendary Punjabi cuisine.", "https://images.unsplash.com/photo-1609946860435-86644f6a9117?auto=format&fit=crop&w=800&q=80"],
            [demoUserId, "Mysore, Karnataka", "City of Palaces", "Marvel at the illuminated Mysore Palace, aromatic sandalwood, heritage architecture, and royal traditions.", "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=800&q=80"],
            [demoUserId, "Udaipur, Rajasthan", "City of Lakes", "Explore majestic palaces, shimmering lakes, and romantic heritage architecture.", "https://images.unsplash.com/photo-1615836245337-f5b9b2303f1c?auto=format&fit=crop&w=800&q=80"]
        ];

        for (const dest of seedData) {
            insertDest.run(...dest);
        }
        console.log('[DB] Demo user and destinations seeded successfully.');
    }
}

// Initialize database
initDatabase();

// ==========================================
// USER DATABASE FUNCTIONS
// ==========================================

function createUser({ username, email, passwordHash }) {
    const stmt = db.prepare(`
        INSERT INTO users (username, email, password_hash)
        VALUES (?, ?, ?)
    `);
    const result = stmt.run(username, email.toLowerCase().trim(), passwordHash);
    return getUserById(result.lastInsertRowid);
}

function getUserByEmail(email) {
    if (!email) return null;
    const stmt = db.prepare('SELECT id, username, email, password_hash, created_at FROM users WHERE email = ?');
    const user = stmt.get(email.toLowerCase().trim());
    if (!user) return null;
    return { ...user, id: String(user.id) };
}

function getUserById(id) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    const stmt = db.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?');
    const user = stmt.get(numericId);
    if (!user) return null;
    return { ...user, id: String(user.id) };
}

// ==========================================
// USER-SCOPED DESTINATION DATABASE FUNCTIONS
// ==========================================

function getAllDestinations(userId) {
    const numericUserId = parseInt(userId, 10);
    if (isNaN(numericUserId)) return [];

    const stmt = db.prepare('SELECT id, user_id, name, tagline, description, image, created_at, updated_at FROM destinations WHERE user_id = ? ORDER BY id DESC');
    const rows = stmt.all(numericUserId);
    return rows.map(row => ({ ...row, id: String(row.id), user_id: String(row.user_id) }));
}

function getDestinationById(id, userId) {
    const numericId = parseInt(id, 10);
    const numericUserId = parseInt(userId, 10);
    if (isNaN(numericId) || isNaN(numericUserId)) return null;

    const stmt = db.prepare('SELECT id, user_id, name, tagline, description, image, created_at, updated_at FROM destinations WHERE id = ? AND user_id = ?');
    const row = stmt.get(numericId, numericUserId);
    if (!row) return null;
    return { ...row, id: String(row.id), user_id: String(row.user_id) };
}

function createDestination(userId, { name, tagline, description, image }) {
    const numericUserId = parseInt(userId, 10);
    if (isNaN(numericUserId)) return null;

    const stmt = db.prepare(`
        INSERT INTO destinations (user_id, name, tagline, description, image)
        VALUES (?, ?, ?, ?, ?)
    `);

    const fallbackImage = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80";
    const result = stmt.run(
        numericUserId,
        name,
        tagline || "Scenic Destination",
        description,
        image && image.trim() ? image.trim() : fallbackImage
    );

    return getDestinationById(result.lastInsertRowid, userId);
}

function updateDestination(id, userId, fields) {
    const existing = getDestinationById(id, userId);
    if (!existing) return null;

    const name = fields.name !== undefined && typeof fields.name === 'string' && fields.name.trim() ? fields.name.trim() : existing.name;
    const tagline = fields.tagline !== undefined && typeof fields.tagline === 'string' ? fields.tagline.trim() : existing.tagline;
    const description = fields.description !== undefined && typeof fields.description === 'string' && fields.description.trim() ? fields.description.trim() : existing.description;
    const image = fields.image !== undefined && typeof fields.image === 'string' && fields.image.trim() ? fields.image.trim() : existing.image;

    const stmt = db.prepare(`
        UPDATE destinations
        SET name = ?, tagline = ?, description = ?, image = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
    `);

    stmt.run(name, tagline, description, image, parseInt(id, 10), parseInt(userId, 10));
    return getDestinationById(id, userId);
}

function deleteDestination(id, userId) {
    const existing = getDestinationById(id, userId);
    if (!existing) return null;

    const stmt = db.prepare('DELETE FROM destinations WHERE id = ? AND user_id = ?');
    stmt.run(parseInt(id, 10), parseInt(userId, 10));
    return existing;
}

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    getAllDestinations,
    getDestinationById,
    createDestination,
    updateDestination,
    deleteDestination
};
