const { QuickBase } = require('quickbase');
require('dotenv').config();
const fs = require('fs').promises;
const fetch = require('node-fetch');

class QuickbaseDeployer {
    constructor() {
        if (!process.env.QUICKBASE_REALM) {
            throw new Error('QUICKBASE_REALM is not set in environment variables');
        }
        if (!process.env.QUICKBASE_USER_TOKEN) {
            throw new Error('QUICKBASE_USER_TOKEN is not set in environment variables');
        }

        console.log('Initializing QuickBase connection to realm:', process.env.QUICKBASE_REALM);
        
        this.qb = new QuickBase({
            realm: process.env.QUICKBASE_REALM,
            userToken: process.env.QUICKBASE_USER_TOKEN,
            // Enable debugging to see API requests
            debug: true
        });
    }

    /**
     * Validates deployment configuration
     * @param {string} appId - The Quickbase application ID
     * @param {string} pageId - The code page ID
     * @param {string} filePath - Path to the file to deploy
     */
    async validateDeployment(appId, pageId, filePath) {
        if (!appId) {
            throw new Error('appId is required');
        }
        if (!pageId) {
            throw new Error('pageId is required');
        }
        if (!filePath) {
            throw new Error('filePath is required');
        }

        // Check if file exists
        try {
            await fs.access(filePath);
        } catch (error) {
            throw new Error(`File ${filePath} does not exist`);
        }
    }

    /**
     * Deploys code to a Quickbase code page
     * @param {string} appId - The Quickbase application ID
     * @param {string} pageId - The code page ID
     * @param {string} code - The code content to deploy
     */
    async deployCodePage(appId, pageId, code) {
        try {
            if (!appId) {
                throw new Error('appId is required but was not provided');
            }
            if (!pageId) {
                throw new Error('pageId is required but was not provided');
            }

            console.log(`Deploying code to page ${pageId} in app ${appId}...`);
            console.log(`Using realm: ${process.env.QUICKBASE_REALM}`);
            
            // Using XML API for page updates since JSON API doesn't support it
            const xmlPayload = `<?xml version="1.0" ?>
                <qdbapi>
                    <usertoken>${process.env.QUICKBASE_USER_TOKEN}</usertoken>
                    <pagename>${pageId}</pagename>
                    <pagetype>1</pagetype>
                    <pagebody><![CDATA[${code}]]></pagebody>
                </qdbapi>`.trim();

            // Ensure the realm is properly formatted
            const realm = process.env.QUICKBASE_REALM.includes('http') 
                ? process.env.QUICKBASE_REALM 
                : `https://${process.env.QUICKBASE_REALM}`;

            const url = `${realm}/db/${appId}`;
            console.log(`Making request to: ${url}`);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/xml',
                    'QUICKBASE-ACTION': 'API_AddReplaceDBPage'
                },
                body: xmlPayload
            });

            const responseText = await response.text();
            console.log('QuickBase API Response:', responseText);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
            }

            if (responseText.includes('<errcode>0</errcode>')) {
                console.log(`Successfully deployed code to page ${pageId} in app ${appId}`);
            } else {
                const errorMatch = responseText.match(/<errtext>(.*?)<\/errtext>/);
                const errorText = errorMatch ? errorMatch[1] : 'Unknown error';
                throw new Error(`QuickBase API error: ${errorText}`);
            }
        } catch (error) {
            console.error(`Error deploying code to page ${pageId} in app ${appId}:`, error);
            throw error;
        }
    }

    /**
     * Reads a file and deploys its contents to a Quickbase code page
     * @param {string} appId - The Quickbase application ID
     * @param {string} pageId - The code page ID
     * @param {string} filePath - Path to the file to deploy
     */
    async deployFile(appId, pageId, filePath) {
        try {
            await this.validateDeployment(appId, pageId, filePath);
            
            console.log(`Reading file ${filePath}...`);
            const code = await fs.readFile(filePath, 'utf8');
            console.log(`Successfully read ${filePath} (${code.length} characters)`);
            
            await this.deployCodePage(appId, pageId, code);
        } catch (error) {
            console.error(`Error deploying file ${filePath}:`, error);
            throw error;
        }
    }

    /**
     * Deploys multiple files to corresponding code pages
     * @param {Object[]} deployments - Array of deployment configs
     * @param {string} deployments[].appId - The Quickbase application ID
     * @param {string} deployments[].pageId - The code page ID
     * @param {string} deployments[].filePath - Path to the file to deploy
     */
    async deployMultiple(deployments) {
        if (!Array.isArray(deployments) || deployments.length === 0) {
            throw new Error('deployments must be a non-empty array');
        }

        for (const deployment of deployments) {
            await this.deployFile(
                deployment.appId,
                deployment.pageId,
                deployment.filePath
            );
        }
    }
}

module.exports = QuickbaseDeployer; 