# Explore India — Travel Guide & REST API Server

[![Node.js](https://img.shields.io/badge/Node.js-v24.14-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v4.19-blue.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-ISC-brightgreen.svg)]()

**Explore India** is a full-stack single-page web application and RESTful API built for **UpStartInterns**. It showcases 10 iconic travel destinations across India with real-time browser interaction (search, create, edit, delete) powered by a Node.js Express backend.

---

## 🌟 Key Features

- 🏙️ **Responsive Frontend**: Semantic HTML5 layout with fluid typography (`clamp()`), CSS Grid card layouts, and mobile-first media queries.
- 🔌 **REST API Backend**: Express server supporting complete CRUD operations (`GET`, `POST`, `PUT`, `DELETE`) on the `/api/destinations` resource.
- 🔍 **Real-Time Search & Filtering**: Instant client-side search filtering by destination name, tagline, or description.
- ➕ **Interactive Modals**: In-browser forms for adding new destinations (`POST`) and editing existing destinations (`PUT`).
- 🔔 **Toast Notification System**: Instant visual feedback banners for all creation, update, and deletion operations.
- 📊 **Status Code Handling**: Strict HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).

---

## 🗺️ Destinations Dataset (10 Default Destinations)

1. **Himachal Pradesh** (*Mountain Paradise*)
2. **Goa** (*Coastal Sunshine*)
3. **Agra** (*Historic Splendor*)
4. **Kerala** (*God's Own Country*)
5. **Jaipur, Rajasthan** (*The Pink City*)
6. **Varanasi** (*Spiritual Heart of India*)
7. **Ladakh** (*Land of High Passes*)
8. **Amritsar, Punjab** (*The Golden City*)
9. **Mysore, Karnataka** (*City of Palaces*)
10. **Darjeeling, West Bengal** (*Queen of the Hills*)

---

## 📡 REST API Reference

Base URL: `http://localhost:3000`

| HTTP Method | Endpoint | Description | Expected Status |
|---|---|---|---|
| `GET` | `/api/destinations` | List all destination records | `200 OK` |
| `GET` | `/api/destinations/:id` | Get single destination record by ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/destinations` | Create a new destination record | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/destinations/:id` | Update fields of an existing record | `200 OK` / `400 Bad Request` / `404 Not Found` |
| `DELETE` | `/api/destinations/:id` | Delete a destination record by ID | `200 OK` / `404 Not Found` |

### Sample JSON Payload (`POST` / `PUT`)
```json
{
  "name": "Kerala",
  "tagline": "God's Own Country",
  "description": "Tranquil backwaters, palm-fringed beaches, and rich heritage.",
  "image": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80"
}
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- `npm`

### Installation & Running Locally

1. **Clone repository**:
   ```bash
   git clone https://github.com/YashikaChandra06/UpStartInterns.git
   cd UpStartInterns
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Access in browser**:
   - Web App: [http://localhost:3000](http://localhost:3000)
   - API Endpoint: [http://localhost:3000/api/destinations](http://localhost:3000/api/destinations)

---

## 🧪 Testing

### Automated Test Suite
Run the built-in API test script to validate all 9 CRUD and status code scenarios (`200`, `201`, `400`, `404`):

```bash
node test-api.js
```

### Testing with `curl`
For complete `curl` commands for GET, POST, PUT, DELETE, and error testing, refer to [curl-examples.md](file:///c:/Users/lenovo/Desktop/PromptWar/UpStartInterns/curl-examples.md).

---

## 📁 Repository Structure

```
UpStartInterns/
├── index.html          # Web application frontend (UI, modals, script integration)
├── server.js            # Express REST API server & static file host
├── package.json        # Node.js project metadata & dependencies
├── test-api.js         # Automated REST API test suite
├── curl-examples.md    # curl command documentation for testing endpoints
└── README.md           # Project documentation
```