# REST API Testing with `curl` & Postman

This document provides ready-to-use `curl` commands for testing all four standard CRUD operations over the **Destinations** resource (`/api/destinations`).

Server URL: `http://localhost:3000`

---

## 1. GET All Destinations
Retrieves a list of all destination records.

```bash
curl -X GET http://localhost:3000/api/destinations
```

**Expected Response**: `200 OK`
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "1",
      "name": "Himachal Pradesh",
      "tagline": "Mountain Paradise",
      "description": "Explore quiet mountain towns, scenic valleys, pine forests and breathtaking Himalayan views.",
      "image": "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80"
    }, ...
  ]
}
```

---

## 2. GET Single Destination by ID
Retrieves details for a specific destination by its ID.

### Valid Record:
```bash
curl -X GET http://localhost:3000/api/destinations/1
```
**Expected Response**: `200 OK`

### Missing Record (Status Code 404):
```bash
curl -i -X GET http://localhost:3000/api/destinations/999
```
**Expected Response**: `HTTP/1.1 404 Not Found`
```json
{
  "success": false,
  "error": "Destination with ID '999' not found."
}
```

---

## 3. POST Create New Destination
Creates a new destination record.

```bash
curl -i -X POST http://localhost:3000/api/destinations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kerala",
    "tagline": "God'\''s Own Country",
    "description": "Serene backwaters, tea gardens, and palm-lined beaches.",
    "image": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80"
  }'
```

**Expected Response**: `HTTP/1.1 201 Created`
```json
{
  "success": true,
  "message": "Destination created successfully.",
  "data": {
    "id": "4",
    "name": "Kerala",
    "tagline": "God's Own Country",
    "description": "Serene backwaters, tea gardens, and palm-lined beaches.",
    "image": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80"
  }
}
```

### Invalid Payload (Missing Name -> Status Code 400):
```bash
curl -i -X POST http://localhost:3000/api/destinations \
  -H "Content-Type: application/json" \
  -d '{"description": "Missing name field"}'
```
**Expected Response**: `HTTP/1.1 400 Bad Request`

---

## 4. PUT Update Destination
Updates fields of an existing destination by ID.

```bash
curl -i -X PUT http://localhost:3000/api/destinations/1 \
  -H "Content-Type: application/json" \
  -d '{
    "tagline": "Majestic Himalayan Paradise",
    "description": "Updated description with new details."
  }'
```

**Expected Response**: `HTTP/1.1 200 OK`

### Missing Record Update (Status Code 404):
```bash
curl -i -X PUT http://localhost:3000/api/destinations/888 \
  -H "Content-Type: application/json" \
  -d '{"name": "Nonexistent"}'
```
**Expected Response**: `HTTP/1.1 404 Not Found`

---

## 5. DELETE Remove Destination
Removes a destination record by ID.

```bash
curl -i -X DELETE http://localhost:3000/api/destinations/2
```

**Expected Response**: `HTTP/1.1 200 OK`
```json
{
  "success": true,
  "message": "Destination 'Goa' (ID: 2) deleted successfully.",
  "data": {
    "id": "2",
    "name": "Goa"
  }
}
```

### Missing Record Delete (Status Code 404):
```bash
curl -i -X DELETE http://localhost:3000/api/destinations/2
```
**Expected Response**: `HTTP/1.1 404 Not Found`
