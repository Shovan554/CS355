const express = require('express');
const Datastore = require('nedb-promises');
const path = require('path');

const app = express();
const db = Datastore.create({ filename: path.join(__dirname, 'database.db'), autoload: true });

app.use(express.json());

app.use(express.static('public'));

// GET /data - Read
app.get('/data', async (req, res) => {
    try {
        let query = {};
        if (req.query.q) {
            try {
                query = JSON.parse(req.query.q);
            } catch (err) {
                return res.status(400).json({ error: ' must be a valid JSON string.' });
            }
        }
        const docs = await db.find(query);
        res.json(docs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /data - Create
app.post('/data', async (req, res) => {
    try {
        const newDoc = await db.insert(req.body);
        res.status(201).json(newDoc);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /data/:id - Replace
app.put('/data/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const numUpdated = await db.update({ _id: id }, req.body, {});
        if (numUpdated === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json({ _id: id, ...req.body });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PATCH /data/:id - Update
app.patch('/data/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const numUpdated = await db.update({ _id: id }, { $set: req.body }, {});
        if (numUpdated === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }
        const updatedDoc = await db.findOne({ _id: id });
        res.json(updatedDoc);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /data/:id - Delete
app.delete('/data/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const numRemoved = await db.remove({ _id: id });
        if (numRemoved === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json({ _id: id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
