import QuickBase from 'quickbase';

const quickbase = new QuickBase({
  realm: 'www',
  appToken: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx'
});

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    try {
      await quickbase.getTempTokenDBID({
        dbid: 'xxxxxxxxx'
      });

      const appResults = await quickbase.getApp({
        appId: 'xxxxxxxxx'
      });

      res.status(200).json({ appName: appResults.name });
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'Failed to fetch data from QuickBase' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}