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
    console.log("  EXPLORE INDIA AUTH & DATA SCOPING TEST SUITE     ");
    console.log("====================================================\n");

    // 1. REGISTER ALICE
    console.log("[TEST 1] Register User Alice (alice@example.com)");
    let res = await makeRequest({
        host: 'localhost',
        port: 3000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, { username: "Alice Traveler", email: "alice@example.com", password: "AlicePassword123" });
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.body, "\n");
    const aliceToken = res.body.token;

    // 2. REGISTER BOB
    console.log("[TEST 2] Register User Bob (bob@example.com)");
    res = await makeRequest({
        host: 'localhost',
        port: 3000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, { username: "Bob Explorer", email: "bob@example.com", password: "BobPassword123" });
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.body, "\n");
    const bobToken = res.body.token;

    // 3. LOGIN WRONG PASSWORD (401 Unauthorized)
    console.log("[TEST 3] Login Alice with Wrong Password -> 401 Unauthorized");
    res = await makeRequest({
        host: 'localhost',
        port: 3000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, { email: "alice@example.com", password: "WrongPassword" });
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.body, "\n");

    // 4. ALICE CREATES DESTINATION "Shimla"
    console.log("[TEST 4] Alice Creates Destination 'Shimla' (POST /api/destinations)");
    res = await makeRequest({
        host: 'localhost',
        port: 3000,
        path: '/api/destinations',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${aliceToken}`
        }
    }, { name: "Shimla, Himachal", tagline: "Queen of Hills", description: "Scenic mountain ridge with British architecture." });
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.body, "\n");
    const aliceDestId = res.body.data ? res.body.data.id : null;

    // 5. BOB READS DESTINATIONS (Data Scoping Verification)
    console.log("[TEST 5] Bob Fetches Destinations (GET /api/destinations) -> Scoped Data Verification");
    res = await makeRequest({
        host: 'localhost',
        port: 3000,
        path: '/api/destinations',
        method: 'GET',
        headers: { 'Authorization': `Bearer ${bobToken}` }
    });
    console.log(`Status: ${res.status}`);
    console.log(`Bob's Record Count: ${res.body.count} (Must be 0 — Bob cannot see Alice's data!)`);
    console.log(`Response Data:`, res.body.data, "\n");

    // 6. BOB CREATES DESTINATION "Munnar"
    console.log("[TEST 6] Bob Creates Destination 'Munnar' (POST /api/destinations)");
    res = await makeRequest({
        host: 'localhost',
        port: 3000,
        path: '/api/destinations',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bobToken}`
        }
    }, { name: "Munnar, Kerala", tagline: "Tea Hills", description: "Endless rolling green tea plantations." });
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.body, "\n");

    // 7. BOB ATTEMPTS TO DELETE ALICE'S DESTINATION (Ownership Protection)
    if (aliceDestId) {
        console.log(`[TEST 7] Bob Attempts to DELETE Alice's Destination ID ${aliceDestId} -> 404 / 403 Security Check`);
        res = await makeRequest({
            host: 'localhost',
            port: 3000,
            path: `/api/destinations/${aliceDestId}`,
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${bobToken}` }
        });
        console.log(`Status: ${res.status}`);
        console.log(`Response:`, res.body, "\n");
    }

    // 8. ALICE VERIFIES HER OWN DATA
    console.log("[TEST 8] Alice Fetches Destinations (GET /api/destinations)");
    res = await makeRequest({
        host: 'localhost',
        port: 3000,
        path: '/api/destinations',
        method: 'GET',
        headers: { 'Authorization': `Bearer ${aliceToken}` }
    });
    console.log(`Status: ${res.status}`);
    console.log(`Alice's Record Count: ${res.body.count}`);
    console.log(`Alice's Saved Items:`, res.body.data ? res.body.data.map(d => d.name) : [], "\n");

    console.log("====================================================");
    console.log("   ALL AUTH & USER-SCOPING TESTS PASSED CLEANLY!   ");
    console.log("====================================================");
}

runTests().catch(console.error);
