#!/usr/bin/env node

// terminal-display.js
const { QuickbaseApiManager } = require('../backend/api');
const chalk = require('chalk');

// Load environment variables
require('dotenv').config();

async function displayQuickbaseData() {
    try {
        // Initialize API Manager with credentials from environment variables
        const apiManager = new QuickbaseApiManager({
            realmHostname: process.env.QUICKBASE_REALM_HOSTNAME,
            userToken: process.env.QUICKBASE_USER_TOKEN,
            appId: process.env.QUICKBASE_APP_ID
        });

        // Display header
        console.log(chalk.bold.blue('=== Quickbase Data Extraction ==='));

        // Extract and display International Client Data
        console.log(chalk.yellow('\n--- International Client Data ---'));
        const clientData = await apiManager.extractInternationalClientData();
        clientData.forEach((record, index) => {
            console.log(chalk.green(`\nRecord ${index + 1}:`));
            Object.entries(record).forEach(([key, value]) => {
                console.log(`  ${chalk.cyan(key)}: ${JSON.stringify(value)}`);
            });
        });

        // Extract and display International Peer Data
        console.log(chalk.yellow('\n--- International Peer Data ---'));
        const peerData = await apiManager.extractInternationalPeerData();
        peerData.forEach((record, index) => {
            console.log(chalk.green(`\nRecord ${index + 1}:`));
            Object.entries(record).forEach(([key, value]) => {
                console.log(`  ${chalk.cyan(key)}: ${JSON.stringify(value)}`);
            });
        });

    } catch (error) {
        console.error(chalk.red('Error extracting Quickbase data:'), error);
    }
}

// Run the display function
displayQuickbaseData();