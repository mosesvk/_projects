// App.js
// Main React component for the Quickbase Data Viewer

// Environment variables - in a real app, these would be loaded from .env
// but for this browser-based example, we're defining them inline
const ENV = {
    QB_REALM: "capincrouse.quickbase.com",
    QB_USER_TOKEN: "b59mcm_dp5d_0_cefk3nbh83jxu8ie9qrbfbri4b", // Note: Token would be secured in a real app
    QB_APP_ID: "bbkmdcurd2sd5cpqvf58dsabq2q",
    QB_TABLEID_INT_CLIENT: "bsz5d5eva",
    QB_TABLEID_INT_PEER: "bs2bkir3i"
  };
  
  // Create a DataStore to match the backend implementation
  class QuickbaseDataStore {
    constructor() {
      // Initialize data stores for different tables
      this.internationalClientData = [];
      this.internationalPeerData = [];
    }
  
    // Setter methods for data
    setData(type, data) {
      switch (type) {
        case "client":
          this.internationalClientData = data;
          break;
        case "peer":
          this.internationalPeerData = data;
          break;
        default:
          throw new Error(`Invalid data type: ${type}`);
      }
    }
  
    // Getter methods for data
    getData(type) {
      switch (type) {
        case "client":
          return this.internationalClientData;
        case "peer":
          return this.internationalPeerData;
        default:
          throw new Error(`Invalid data type: ${type}`);
      }
    }
  }
  
  // Main App component
  function App() {
    const [status, setStatus] = React.useState('Initializing...');
    const [clientData, setClientData] = React.useState([]);
    const [peerData, setPeerData] = React.useState([]);
    const dataStore = React.useRef(new QuickbaseDataStore());
    const clientRef = React.useRef(null);
  
    // Initialize Quickbase client when component mounts
    React.useEffect(() => {
      // For local development, force  data to true
      const forceMockData = true; // Set to false when deploying to Quickbase
      
      // Initialize the client
      clientRef.current = new QuickbaseClient({
        realmHostname: ENV.QB_REALM,
        userToken: ENV.QB_USER_TOKEN,
        appId: ENV.QB_APP_ID,
        useMockData: forceMockData // Force mock data during development
      });
  
      // Test connection
      testConnection();
    }, []);
  
    // Test connection to Quickbase
    const testConnection = async () => {
      try {
        setStatus('Testing connection...');
        const result = await clientRef.current.testConnection();
        
        if (result.success) {
          setStatus('Connected successfully');
          fetchData();
        } else {
          setStatus('Connection failed: ' + result.error.message);
        }
      } catch (error) {
        setStatus('Connection error: ' + error.message);
        console.error('Connection error:', error);
      }
    };
  
    // Fetch data from both tables
    const fetchData = async () => {
      try {
        setStatus('Fetching data...');
        
        // Fetch client data
        const clientResult = await extractData({
          type: 'client',
          tableId: ENV.QB_TABLEID_INT_CLIENT,
          selectIds: [29, 192, 157, 158, 159, 160, 141, 142, 143],
          top: 5
        });
        
        // Fetch peer data
        const peerResult = await extractData({
          type: 'peer',
          tableId: ENV.QB_TABLEID_INT_PEER,
          selectIds: [301, 59, 60, 62, 63, 64, 66, 261],
          top: 10
        });
  
        // Update state with fetched data
        setClientData(clientResult);
        setPeerData(peerResult);
        setStatus('Data fetched successfully');
        
        // Log data to console for future use
        console.log('Client Data:', clientResult);
        console.log('Peer Data:', peerResult);
        
      } catch (error) {
        setStatus('Error fetching data: ' + error.message);
        console.error('Error fetching data:', error);
      }
    };
  
    // Extract data from a specific table (similar to backend implementation)
    const extractData = async (options) => {
      const { type, tableId, selectIds, where = "", top = 10 } = options;
  
      // Validate input
      if (!["client", "peer"].includes(type)) {
        throw new Error(`Invalid data type: ${type}. Must be 'client' or 'peer'.`);
      }
  
      // Prepare query options
      const queryOptions = {
        tableId: tableId,
        select: selectIds,
        top: top,
      };
  
      // Add where clause if provided
      if (where) {
        queryOptions.where = where;
      }
  
      try {
        // Execute query
        const extractedData = await clientRef.current.queryRecords(queryOptions);
        
        // Store data in the dataStore
        dataStore.current.setData(type, extractedData.data);
        
        // Return the data
        return extractedData.data;
      } catch (error) {
        console.error(`Error extracting ${type} data:`, error);
        throw error;
      }
    };
  
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <header className="bg-white shadow rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Quickbase Data Viewer</h1>
          <p className="text-gray-600 mt-2">Status: {status}</p>
        </header>
        
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Data Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Client Data</h3>
              <p className="text-gray-600">{clientData.length} records fetched</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Peer Data</h3>
              <p className="text-gray-600">{peerData.length} records fetched</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-md">
            <h3 className="font-medium text-yellow-800 mb-2">⚠️ Development Mode</h3>
            <p className="text-yellow-700 mb-2">
              Currently using <strong>mock data</strong> for local development.
            </p>
            <p className="text-yellow-700 mb-2">
              When deployed to Quickbase code pages, set <code>forceMockData = false</code> to
              use real API data.
            </p>
            <p className="text-yellow-700">
              Check the browser console (F12) to see the mock data structure.
            </p>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Deployment to Quickbase</h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Complete local development with mock data</li>
            <li>Set <code>forceMockData = false</code> in the App.js file</li>
            <li>Bundle all JavaScript into a single file:
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Combine QuickbaseClient.js, App.js, and any other components</li>
                <li>Minify if desired using a tool like Terser</li>
              </ul>
            </li>
            <li>Create a new code page in Quickbase:
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Add React and Babel scripts from CDN</li>
                <li>Add your bundled JavaScript</li>
                <li>Add HTML structure with root div</li>
                <li>Add initialization code to render the React app</li>
              </ul>
            </li>
            <li>Deploy and test in Quickbase environment</li>
          </ol>
        </div>
      </div>
    );
  }