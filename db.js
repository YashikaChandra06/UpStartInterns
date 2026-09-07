const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const dbPath = path.join(__dirname, 'destinations.db');
const db = new DatabaseSync(dbPath);

// Initialize Database Schema
function initDatabase() {
    // 1. Create table if not exists
    db.exec(`
        CREATE TABLE IF NOT EXISTS destinations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            tagline TEXT,
            description TEXT NOT NULL,
            image TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // 2. Check if table is empty, seed 10 initial destinations if empty
    const countStmt = db.prepare('SELECT COUNT(*) as count FROM destinations');
    const row = countStmt.get();

    if (row.count === 0) {
        console.log('[DB] Database empty. Seeding 10 initial destinations...');
        const insertStmt = db.prepare(`
            INSERT INTO destinations (name, tagline, description, image)
            VALUES (?, ?, ?, ?)
        `);

        const seedData = [
            ["Himachal Pradesh", "Mountain Paradise", "Explore quiet mountain towns, scenic valleys, pine forests and breathtaking Himalayan views.", "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80"],
            ["Goa", "Coastal Sunshine", "Relax beside the Arabian Sea, enjoy local food and experience Goa's vibrant coastal culture.", "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"],
            ["Agra", "Historic Splendor", "Visit the Taj Mahal and discover the rich Mughal history and architecture of the city.", "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80"],
            ["Kerala", "God's Own Country", "Experience tranquil backwaters, palm-fringed beaches, tea plantations, and rich Ayurveda heritage.", "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80"],
            ["Jaipur, Rajasthan", "The Pink City", "Discover grand royal palaces, historic hilltop forts, vibrant bazaars, and rich Rajasthani culture.", "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80"],
            ["Varanasi", "Spiritual Heart of India", "Witness timeless spiritual traditions, ancient ghats along the sacred Ganges river, and evening Aarti ceremonies.", "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80"],
            ["Ladakh", "Land of High Passes", "Explore dramatic high-altitude desert landscapes, crystal-clear alpine lakes, and ancient Buddhist monasteries.", "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80"],
            ["Amritsar, Punjab", "The Golden City", "Visit the revered Golden Temple, experience rich Sikh heritage, vibrant culture, and legendary Punjabi cuisine.", "https://images.unsplash.com/photo-1609946860435-86644f6a9117?auto=format&fit=crop&w=800&q=80"],
            ["Mysore, Karnataka", "City of Palaces", "Marvel at the illuminated Mysore Palace, aromatic sandalwood, heritage architecture, and royal traditions.", "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=800&q=80"],
            ["Darjeeling, West Bengal", "Queen of the Hills", "Enjoy rolling tea estates, panoramic views of Mount Kanchenjunga, and the historic Himalayan toy train.", "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"],
            ["Udaipur, Rajasthan", "City of Lakes", "Explore majestic palaces, shimmering lakes, and romantic heritage architecture.", "https://images.unsplash.com/photo-1615836245337-f5b9b2303f1c?auto=format&fit=crop&w=800&q=80"]
        ];

        for (const dest of seedData) {
            insertStmt.run(...dest);
        }
        console.log('[DB] Seeding completed successfully.');
    }

    // Ensure Udaipur exists if not present in existing DB
    const checkUdaipur = db.prepare("SELECT COUNT(*) as count FROM destinations WHERE name LIKE ?").get("%Udaipur%");
    if (checkUdaipur.count === 0) {
        const insertStmt = db.prepare(`
            INSERT INTO destinations (name, tagline, description, image)
            VALUES (?, ?, ?, ?)
        `);
        insertStmt.run("Udaipur, Rajasthan", "City of Lakes", "Explore majestic palaces, shimmering lakes, and romantic heritage architecture.", "https://images.unsplash.com/photo-1615836245337-f5b9b2303f1c?auto=format&fit=crop&w=800&q=80");
        console.log('[DB] Added Udaipur to database.');
    }
}

// Initialize on module load
initDatabase();

// ==========================================
// DATABASE QUERY FUNCTIONS
// ==========================================

function getAllDestinations() {
    const stmt = db.prepare('SELECT id, name, tagline, description, image, created_at, updated_at FROM destinations ORDER BY id ASC');
    const rows = stmt.all();
    return rows.map(row => ({ ...row, id: String(row.id) }));
}

function getDestinationById(id) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    const stmt = db.prepare('SELECT id, name, tagline, description, image, created_at, updated_at FROM destinations WHERE id = ?');
    const row = stmt.get(numericId);
    if (!row) return null;
    return { ...row, id: String(row.id) };
}

function createDestination({ name, tagline, description, image }) {
    const stmt = db.prepare(`
        INSERT INTO destinations (name, tagline, description, image)
        VALUES (?, ?, ?, ?)
    `);

    const fallbackImage = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80";
    const result = stmt.run(
        name,
        tagline || "Scenic Destination",
        description,
        image && image.trim() ? image.trim() : fallbackImage
    );

    return getDestinationById(result.lastInsertRowid);
}

function updateDestination(id, fields) {
    const existing = getDestinationById(id);
    if (!existing) return null;

    const name = fields.name !== undefined && typeof fields.name === 'string' && fields.name.trim() ? fields.name.trim() : existing.name;
    const tagline = fields.tagline !== undefined && typeof fields.tagline === 'string' ? fields.tagline.trim() : existing.tagline;
    const description = fields.description !== undefined && typeof fields.description === 'string' && fields.description.trim() ? fields.description.trim() : existing.description;
    const image = fields.image !== undefined && typeof fields.image === 'string' && fields.image.trim() ? fields.image.trim() : existing.image;

    const stmt = db.prepare(`
        UPDATE destinations
        SET name = ?, tagline = ?, description = ?, image = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `);

    stmt.run(name, tagline, description, image, parseInt(id, 10));
    return getDestinationById(id);
}

function deleteDestination(id) {
    const existing = getDestinationById(id);
    if (!existing) return null;

    const stmt = db.prepare('DELETE FROM destinations WHERE id = ?');
    stmt.run(parseInt(id, 10));
    return existing;
}

module.exports = {
    getAllDestinations,
    getDestinationById,
    createDestination,
    updateDestination,
    deleteDestination
};
