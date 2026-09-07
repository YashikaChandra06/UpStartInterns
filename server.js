const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// In-memory data store for the 'destinations' resource
let destinations = [
    {
        id: "1",
        name: "Himachal Pradesh",
        tagline: "Mountain Paradise",
        description: "Explore quiet mountain towns, scenic valleys, pine forests and breathtaking Himalayan views.",
        image: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "2",
        name: "Goa",
        tagline: "Coastal Sunshine",
        description: "Relax beside the Arabian Sea, enjoy local food and experience Goa's vibrant coastal culture.",
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "3",
        name: "Agra",
        tagline: "Historic Splendor",
        description: "Visit the Taj Mahal and discover the rich Mughal history and architecture of the city.",
        image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "4",
        name: "Kerala",
        tagline: "God's Own Country",
        description: "Experience tranquil backwaters, palm-fringed beaches, tea plantations, and rich Ayurveda heritage.",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "5",
        name: "Jaipur, Rajasthan",
        tagline: "The Pink City",
        description: "Discover grand royal palaces, historic hilltop forts, vibrant bazaars, and rich Rajasthani culture.",
        image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "6",
        name: "Varanasi",
        tagline: "Spiritual Heart of India",
        description: "Witness timeless spiritual traditions, ancient ghats along the sacred Ganges river, and evening Aarti ceremonies.",
        image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "7",
        name: "Ladakh",
        tagline: "Land of High Passes",
        description: "Explore dramatic high-altitude desert landscapes, crystal-clear alpine lakes, and ancient Buddhist monasteries.",
        image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "8",
        name: "Amritsar, Punjab",
        tagline: "The Golden City",
        description: "Visit the revered Golden Temple, experience rich Sikh heritage, vibrant culture, and legendary Punjabi cuisine.",
        image: "https://images.unsplash.com/photo-1609946860435-86644f6a9117?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "9",
        name: "Mysore, Karnataka",
        tagline: "City of Palaces",
        description: "Marvel at the illuminated Mysore Palace, aromatic sandalwood, heritage architecture, and royal traditions.",
        image: "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "10",
        name: "Darjeeling, West Bengal",
        tagline: "Queen of the Hills",
        description: "Enjoy rolling tea estates, panoramic views of Mount Kanchenjunga, and the historic Himalayan toy train.",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"
    }
];

let nextId = 11;

// ==========================================
// REST API ROUTES (/api/destinations)
// ==========================================

// 1. GET /api/destinations — List all destinations
app.get('/api/destinations', (req, res) => {
    res.status(200).json({
        success: true,
        count: destinations.length,
        data: destinations
    });
});

// 2. GET /api/destinations/:id — Get a single destination by ID
app.get('/api/destinations/:id', (req, res) => {
    const { id } = req.params;
    const destination = destinations.find(item => item.id === id);

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
});

// 3. POST /api/destinations — Create a new destination
app.post('/api/destinations', (req, res) => {
    const { name, tagline, description, image } = req.body;

    // Data Validation (JSON In)
    if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
            success: false,
            error: "Validation Error: 'name' is required and must be a non-empty string."
        });
    }

    if (!description || typeof description !== 'string' || !description.trim()) {
        return res.status(400).json({
            success: false,
            error: "Validation Error: 'description' is required and must be a non-empty string."
        });
    }

    const newDestination = {
        id: String(nextId++),
        name: name.trim(),
        tagline: tagline ? tagline.trim() : "Scenic Destination",
        description: description.trim(),
        image: image && image.trim() 
            ? image.trim() 
            : "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80"
    };

    destinations.push(newDestination);

    res.status(201).json({
        success: true,
        message: "Destination created successfully.",
        data: newDestination
    });
});

// 4. PUT /api/destinations/:id — Update an existing destination
app.put('/api/destinations/:id', (req, res) => {
    const { id } = req.params;
    const destinationIndex = destinations.findIndex(item => item.id === id);

    if (destinationIndex === -1) {
        return res.status(404).json({
            success: false,
            error: `Destination with ID '${id}' not found.`
        });
    }

    const { name, tagline, description, image } = req.body;

    // Validate payload is non-empty object
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            success: false,
            error: "Validation Error: Request body cannot be empty."
        });
    }

    // Update fields if provided
    const existing = destinations[destinationIndex];
    const updatedDestination = {
        ...existing,
        name: name !== undefined && typeof name === 'string' && name.trim() ? name.trim() : existing.name,
        tagline: tagline !== undefined && typeof tagline === 'string' ? tagline.trim() : existing.tagline,
        description: description !== undefined && typeof description === 'string' && description.trim() ? description.trim() : existing.description,
        image: image !== undefined && typeof image === 'string' && image.trim() ? image.trim() : existing.image
    };

    destinations[destinationIndex] = updatedDestination;

    res.status(200).json({
        success: true,
        message: `Destination with ID '${id}' updated successfully.`,
        data: updatedDestination
    });
});

// 5. DELETE /api/destinations/:id — Delete a destination by ID
app.delete('/api/destinations/:id', (req, res) => {
    const { id } = req.params;
    const destinationIndex = destinations.findIndex(item => item.id === id);

    if (destinationIndex === -1) {
        return res.status(404).json({
            success: false,
            error: `Destination with ID '${id}' not found.`
        });
    }

    const deletedItem = destinations.splice(destinationIndex, 1)[0];

    res.status(200).json({
        success: true,
        message: `Destination '${deletedItem.name}' (ID: ${id}) deleted successfully.`,
        data: { id: deletedItem.id, name: deletedItem.name }
    });
});

// Serve frontend for SPA / Root
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` Explore India API Server running on port ${PORT}`);
    console.log(` Local URL: http://localhost:${PORT}`);
    console.log(` API Resource: http://localhost:${PORT}/api/destinations`);
    console.log(`====================================================`);
});
