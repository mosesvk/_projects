require('dotenv').config();

// Validate environment variables
if (!process.env.QUICKBASE_APP_ID) {
    throw new Error('QUICKBASE_APP_ID environment variable is not set');
}

module.exports = {
    // Add your deployments here
    deployments: [
        {
            appId: process.env.QUICKBASE_APP_ID,
            pageId: 'higherEd_index',  // Page name without extension
            filePath: 'test.html'
        },
        // Add more deployments as needed
        // {
        //     appId: 'another_app_id',
        //     pageId: 'another_page_id',
        //     filePath: 'another-file.js'
        // }
    ]
}; 