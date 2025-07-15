// display.js

// Function to fetch data and update the HTML
async function fetchData(apiUrl, elementId) {
    const preElement = document.getElementById(elementId);
    if (!preElement) {
        console.error(`Element with ID ${elementId} not found.`);
        return;
    }

    preElement.textContent = 'Loading...'; // Indicate loading

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            // Try to get error details from the server's JSON response
            const errorData = await response.json().catch(() => ({ error: 'Unknown error structure' }));
            throw new Error(`HTTP error ${response.status}: ${errorData?.error || response.statusText}. ${errorData?.details || ''}`);
        }
        const data = await response.json();

        // Format the JSON data nicely for display in <pre>
        preElement.textContent = JSON.stringify(data, null, 2); // null, 2 for pretty printing

    } catch (error) {
        console.error(`Failed to fetch or display data from ${apiUrl}:`, error);
        preElement.textContent = `Error loading data: ${error.message}`;
        preElement.style.color = 'red'; // Make errors visible
    }
}

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded. Fetching data...");
    // Fetch data for clients (using the endpoint from server.js)
    fetchData('/api/dynamic-clients', 'clientDataLog');

    // Fetch data for peers (using the endpoint from server.js)
    fetchData('/api/peers', 'peerDataLog');

    // You could add another section in your HTML and fetch the dynamic data too:
    // fetchData('/api/dynamic-clients', 'dynamicDataLog');
});