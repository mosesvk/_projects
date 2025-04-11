// quickbase-data-app.js
// This script handles the data fetching and display logic

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize API Manager with credentials
        // Note: Replace these with your actual Quickbase credentials
        const apiManager = new QuickbaseApiManager({
            realmHostname: 'your-realm.quickbase.com',
            userToken: 'YOUR_USER_TOKEN',
            appId: 'YOUR_APP_ID'
        });

        // Fetch and display client data
        const clientData = await apiManager.extractInternationalClientData();
        const clientDataLog = document.getElementById('clientDataLog');
        clientDataLog.textContent = JSON.stringify(clientData, null, 2);

        // Fetch and display peer data
        const peerData = await apiManager.extractInternationalPeerData();
        const peerDataLog = document.getElementById('peerDataLog');
        peerDataLog.textContent = JSON.stringify(peerData, null, 2);

    } catch (error) {
        console.error('Error fetching Quickbase data:', error);
        
        // Display error in logs
        const clientDataLog = document.getElementById('clientDataLog');
        const peerDataLog = document.getElementById('peerDataLog');
        
        clientDataLog.textContent = `Error fetching client data: ${error.message}`;
        peerDataLog.textContent = `Error fetching peer data: ${error.message}`;
    }
});