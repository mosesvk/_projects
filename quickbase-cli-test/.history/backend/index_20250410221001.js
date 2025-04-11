// server.js
require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const path = require('path'); // Needed for serving HTML file
const { QuickbaseApiManager } = require('./api'); // Adjust path if needed



const app = express();
app.use(cors());
app.use(cors({
    origin: 'http://127.0.0.1:5500'
  }));
const port = 3000; // You can choose any available port

// Initialize the API Manager (ensure QB variables are in .env)
// const apiManager = new QuickbaseApiManager({
//     realmHostname: 'capincrouse.quickbase.com',
//     userToken: process.env.QB_USER_TOKEN,
//     appId: process.env.QB_APP_ID
// });

// API endpoint to get International Client Data
app.get('/api/clients', async (req, res) => {
    console.log("Request received for /api/clients"); // Server log
    try {
        // Use the existing method, assuming it's fixed and has error handling
        // Ensure the 'where' clause is correct inside this method
        const clientData = await apiManager.extractInternationalClientData();
        res.json(clientData); // Send data back as JSON
    } catch (error) {
        console.error("Error fetching client data for API:", error.message);
        // Send a generic error message to the client
        res.status(500).json({ error: 'Failed to fetch client data', details: error.message });
    }
});

// API endpoint to get International Peer Data (Add this if needed)
app.get('/api/peers', async (req, res) => {
    console.log("Request received for /api/peers"); // Server log
    try {
        // Make sure QB_TABLEID_INT_PEER is in your .env file
        if (!process.env.QB_TABLEID_INT_PEER) {
            throw new Error("QB_TABLEID_INT_PEER environment variable not set.");
        }
        const peerData = await apiManager.extractInternationalPeerData();
        res.json(peerData);
    } catch (error) {
        console.error("Error fetching peer data for API:", error.message);
        res.status(500).json({ error: 'Failed to fetch peer data', details: error.message });
    }
});

// API endpoint for the dynamic data example
app.get('/api/dynamic-clients', async (req, res) => {
    console.log("Request received for /api/dynamic-clients"); // Server log
    try {
         if (!process.env.QB_TABLEID_INT_CLIENT) {
            throw new Error("QB_TABLEID_INT_CLIENT environment variable not set.");
        }
        const dynamicData = await apiManager.extractData({
            type: 'client', // Ensure this matches a valid type if you added more
            tableId: process.env.QB_TABLEID_INT_CLIENT,
            selectIds: [1, 2, 3, 4], // Example fields
            top: 5
        });
        res.json(dynamicData);
    } catch (error) {
        console.error("Error fetching dynamic client data for API:", error.message);
        res.status(500).json({ error: 'Failed to fetch dynamic data', details: error.message });
    }
});


// Serve the HTML file
// Assuming your HTML file is named 'index.html' and is in a 'public' subfolder
// If your HTML is elsewhere, adjust the path accordingly.
// Let's assume index.html is in the root for simplicity here:
app.get('/', (req, res) => {
    // Use path.join for cross-platform compatibility
    // __dirname is the directory where server.js is located
    res.sendFile(path.join(__dirname, 'index.html')); // Adjust 'index.html' if your file is named differently
});

// Serve static files (like display.js) if they are in a specific folder
// If display.js is in the root with index.html, this might not be strictly needed
// but it's good practice for CSS, images, etc.
// app.use(express.static(path.join(__dirname, 'public'))); // Example if using a 'public' folder

// Also serve the browser-side script (display.js)
// This makes it accessible via <script src="/display.js"></script>
app.get('/display.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'display.js')); // Serve display.js from the root
});


// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    console.log("API endpoints available at:");
    console.log(`  http://localhost:${port}/api/clients`);
    console.log(`  http://localhost:${port}/api/peers`);
    console.log(`  http://localhost:${port}/api/dynamic-clients`);
});