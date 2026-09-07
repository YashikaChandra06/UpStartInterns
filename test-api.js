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
    console.log("    EXPLORE INDIA SQLITE DATABASE API TEST SUITE    ");
    console.log("====================================================\n");

    // 1. GET ALL
    console.log("[TEST 1] GET /api/destinations (List All from SQLite DB)");
    let res = await makeRequest({ host: 'localhost', port: 3000, path: '/api/destinations', method: 'GET' });
    console.log(`Status: ${res.status}`);
    console.log(`Count: ${res.body.count}`);
    console.log(`Response Data Sample:`, res.body.data ? res.body.data.slice(0, 2) : res.body, "\n");

    // 2. GET BY ID (Valid)
    console.log("[TEST 2] GET /api/destinations/1 (Get Single Record from DB)");
    res = await makeRequest({ host: 'localhost', port: 3000, path: '/api/destinations/1', method: 'GET' });
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.body, "\n");

    // 3. GET BY ID (Missing -> 404)
    console.log("[TEST 3] GET /api/destinations/999 (Missing Record -> 404 Not Found)");
    res = await makeRequest({ host: 'localhost', port: 3000, path: '/api/destinations/999', method: 'GET' });
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.body, "\n");

    // 4. POST CREATE (Valid -> 201 -> Stored in SQLite DB)
    console.log("[TEST 4] POST /api/destinations (Create 'Udaipur' -> 201 Created)");
    const newDest = {
        name: "Udaipur, Rajasthan",
        tagline: "City of Lakes",
        description: "Explore majestic palaces, shimmering lakes, and romantic heritage architecture.",
        image: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f1c?auto=format&fit=crop&w=800&q=80"
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
    const createdId = res.body.data ? res.body.data.id : null;

    // 5. POST CREATE (Validation Failure -> 400 Bad Request before DB storage)
    console.log("[TEST 5] POST /api/destinations (Invalid Payload -> 400 Bad Request)");
    res = await makeRequest({ 
        host: 'localhost', 
        port: 3000, 
        path: '/api/destinations', 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, { description: "Missing name field" });
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.body, "\n");

    // 6. PUT UPDATE (Valid -> 200 -> Update SQLite DB)
    if (createdId) {
        console.log(`[TEST 6] PUT /api/destinations/${createdId} (Update Record -> 200 OK)`);
        res = await makeRequest({ 
            host: 'localhost', 
            port: 3000, 
            path: `/api/destinations/${createdId}`, 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        }, { tagline: "Venice of the East & City of Lakes" });
        console.log(`Status: ${res.status}`);
        console.log(`Response:`, res.body, "\n");
    }

    // 7. DELETE (Valid -> 200 OK)
    console.log("[TEST 7] DELETE /api/destinations/2 (Delete 'Goa' -> 200 OK)");
    res = await makeRequest({ host: 'localhost', port: 3000, path: '/api/destinations/2', method: 'DELETE' });
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.body, "\n");

    // 8. VERIFY PERSISTENCE (GET ALL to confirm count)
    console.log("[TEST 8] VERIFY DATABASE STATE (GET /api/destinations)");
    res = await makeRequest({ host: 'localhost', port: 3000, path: '/api/destinations', method: 'GET' });
    console.log(`Status: ${res.status}`);
    console.log(`Total Records in Database: ${res.body.count}`);

    console.log("\n====================================================");
    console.log("      SQLITE DATABASE API TESTS COMPLETED!         ");
    console.log("====================================================");
}

runTests().catch(console.error);
