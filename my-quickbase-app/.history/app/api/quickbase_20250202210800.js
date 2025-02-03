import axios from 'axios';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    try {
      const response = await axios.get('https://api.quickbase.com/v1/records', {
        headers: {
          'QB-Realm-Hostname': 'your-realm.quickbase.com',
          'User-Agent': 'MyApp (your-email@example.com)',
          'Authorization': 'QB-USER-TOKEN your-user-token',
          'Content-Type': 'application/json'
        }
      });

      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data from Quickbase' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}