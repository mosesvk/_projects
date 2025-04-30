const QuickbaseDeployer = require('./quickbase-deploy');
const config = require('./deploy-config');

async function deploy() {
    try {
        console.log('Starting deployment process...');
        console.log('Configuration:', JSON.stringify(config, null, 2));
        
        console.log('Initializing QuickBase deployer...');
        const deployer = new QuickbaseDeployer();
        
        console.log('Starting file deployments...');
        for (const deployment of config.deployments) {
            console.log(`Preparing to deploy ${deployment.filePath} to page ${deployment.pageId} in app ${deployment.appId}`);
        }
        
        await deployer.deployMultiple(config.deployments);
        console.log('All deployments completed successfully!');
    } catch (error) {
        console.error('Deployment failed with error:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
}

// Add error handling for uncaught promises
process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
    process.exit(1);
});

deploy(); 