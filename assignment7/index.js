const express = require('express');       // load express module
const nedb = require("nedb-promises");    // load nedb module

const app = express();                    // init app
const db = nedb.create('users.jsonl');    // init db

app.use(express.static('public'));        // enable static routing to "./public" folder
app.use(express.json());                  // decode all requests from JSON

// create route to get all user records (GET /users)
app.get('/users', (req, res) => {
    db.find({})
        .then(docs => res.send(docs))
        .catch(error => res.send({ error }));
});

// create route to get user record (GET /users/:username)
app.get('/users/:username', (req, res) => {
    db.findOne({ username: req.params.username })
        .then(doc => {
            if (doc) res.send(doc);
            else res.send({ error: 'Username not found.' });
        })
        .catch(error => res.send({ error }));
});

// create route to register user (POST /users)
app.post('/users', (req, res) => {
    const { username, password, email, name } = req.body;
    if (!username || !password || !email || !name) {
        return res.send({ error: 'Missing fields.' });
    }
    db.findOne({ username })
        .then(doc => {
            if (doc) {
                res.send({ error: 'Username already exists.' });
            } else {
                db.insertOne(req.body)
                    .then(newDoc => res.send(newDoc))
                    .catch(error => res.send({ error }));
            }
        })
        .catch(error => res.send({ error }));
});

// create route to update user doc (PATCH /users/:username)
app.patch('/users/:username', (req, res) => {
    db.updateOne({ username: req.params.username }, { $set: req.body })
        .then(numUpdated => {
            if (numUpdated === 0) res.send({ error: 'Something went wrong.' });
            else res.send({ ok: true });
        })
        .catch(error => res.send({ error }));
});

// create route to delete user doc (DELETE /users/:username)
app.delete('/users/:username', (req, res) => {
    db.deleteOne({ username: req.params.username })
        .then(numDeleted => {
            if (numDeleted === 0) res.send({ error: 'Something went wrong.' });
            else res.send({ ok: true });
        })
        .catch(error => res.send({ error }));
});


// default route
app.use((req, res) => { res.status(404).send('Invalid URL.') });

// start server
app.listen(3000,()=>console.log("Server started on http://localhost:3000"));
