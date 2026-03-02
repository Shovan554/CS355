const express = require('express');
const app = express();
const port = 3000;
const Datastore = require('nedb-promises');

const db = Datastore.create('hits.jsonl');

app.use(express.static('public'));

app.get('/hits/:pageID', async (req, res) => {
  const pageID = req.params.pageID;
  
  try {

    await db.update({ pageID: pageID }, { $inc: { hits: 1 } }, { upsert: true });
    const doc = await db.findOne({ pageID: pageID });
    res.json({ page: pageID, hits: doc.hits });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
