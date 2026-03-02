const express = require('express');
const Datastore = require('nedb-promises');
const path = require('path');

const app = express();
const db = Datastore.create({ filename: 'database.db', autoload: true });

app.use(express.json());
app.use(express.static('public'));

app.post('/insert', async (req, res) => {
  try {
    const doc = req.body;
    const newDoc = await db.insert(doc);
    res.json(newDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/search', async (req, res) => {
  try {
    const query = req.body;
    const docs = await db.find(query);
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
