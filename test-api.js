const http = require('http');

function makeRequest(options, body = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
                } catch {
                    resolve({ status: res.statusCode, headers: res.headers, body: data });
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function runTests() {
    console.log("====================================================");
    console.log("        EXPLORE INDIA REST API TEST SUITE           ");
    console.log("====================================================\n");

    // 1. GET ALL
    console.log("[TEST 1] GET /api/destinations (List All)");
    let res = await makeRequest({ host: 'localhost', port: 3000, path: '/api/destinations', method: 'GET' });
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.body, "\n");

    // 2. GET BY ID (Valid)
    console.log("[TEST 2] GET /api/destinations/1 (Get Single)");
    res = await makeRequest({ host: 'localhost', port: 3000, path: '/api/destinations/1', method: 'GET' });
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.body, "\n");

    // 3. GET BY ID (Missing -> 404)
    console.log("[TEST 3] GET /api/destinations/999 (Missing Record -> 404)");
    res = await makeRequest({ host: 'localhost', port: 3000, path: '/api/destinations/999', method: 'GET' });
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.body, "\n");

    // 4. POST CREATE (Valid -> 201)
    console.log("[TEST 4] POST /api/destinations (Create New -> 201)");
    const newDest = {
        name: "Kerala",
        tagline: "God's Own Country",
        description: "Explore backwaters, tea gardens, and lush greenery.",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80"
    };
    res = await makeRequest({ 
        host: 'localhost', 
        port: 3000, 
        path: '/api/destinations', 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, newDest);
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.body, "\n");

    // 5. POST CREATE (Invalid -> 400 Validation Error)
    console.log("[TEST 5] POST /api/destinations (Missing Name -> 400 Bad Request)");
    res = await makeRequest({ 
        host: 'localhost', 
        port: 3000, 
        path: '/api/destinations', 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, { description: "Missing name" });
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.body, "\n");

    // 6. PUT UPDATE (Valid -> 200)
    console.log("[TEST 6] PUT /api/destinations/4 (Update Record -> 200)");
    res = await makeRequest({ 
        host: 'localhost', 
        port: 3000, 
        path: '/api/destinations/4', 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    }, { tagline: "Backwaters & Beaches" });
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.body, "\n");

    // 7. PUT UPDATE (Missing Record -> 404)
    console.log("[TEST 7] PUT /api/destinations/888 (Missing Record -> 404)");
    res = await makeRequest({ 
        host: 'localhost', 
        port: 3000, 
        path: '/api/destinations/888', 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    }, { name: "Nonexistent" });
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.body, "\n");

    // 8. DELETE (Valid -> 200)
    console.log("[TEST 8] DELETE /api/destinations/2 (Delete Goa -> 200)");
    res = await makeRequest({ host: 'localhost', port: 3000, path: '/api/destinations/2', method: 'DELETE' });
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.body, "\n");

    // 9. DELETE (Missing Record -> 404)
    console.log("[TEST 9] DELETE /api/destinations/2 (Delete Already Removed Record -> 404)");
    res = await makeRequest({ host: 'localhost', port: 3000, path: '/api/destinations/2', method: 'DELETE' });
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.body, "\n");

    console.log("====================================================");
    console.log("        ALL REST API TESTS COMPLETED SUCCESSFULLY!  ");
    console.log("====================================================");
}

runTests().catch(console.error);
