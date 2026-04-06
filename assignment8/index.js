const express = require('express');       // load express module
const nedb = require("nedb-promises");    // load nedb module
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();                    // init app
const db = nedb.create('users.jsonl');    // init db

const JWT_SECRET = 'super-secret-key';

app.use(express.static('public'));        // enable static routing to "./public" folder
app.use(express.json());                  // decode all requests from JSON

// create route to get all user records (GET /users)
app.get('/users', (req, res) => {
    db.find({}, { password: 0, authenticationToken: 0 })
        .then(docs => res.send(docs))
        .catch(error => res.send({ error }));
});

// create route to get user record (GET /users/:username)
app.get('/users/:username', (req, res) => {
    db.findOne({ username: req.params.username }, { password: 0, authenticationToken: 0 })
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
                const hashedPassword = bcrypt.hashSync(password, 10);
                const token = jwt.sign({ username }, JWT_SECRET);
                const newUser = { username, password: hashedPassword, email, name, authenticationToken: token };
                db.insertOne(newUser)
                    .then(newDoc => {
                        const { password: _, ...userWithoutPassword } = newDoc;
                        res.send(userWithoutPassword);
                    })
                    .catch(error => res.send({ error }));
            }
        })
        .catch(error => res.send({ error }));
});

// create route to authenticate user (POST /users/auth)
app.post('/users/auth', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.send({ error: 'Missing fields.' });
    }
    db.findOne({ username })
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = jwt.sign({ username }, JWT_SECRET);
                db.updateOne({ username }, { $set: { authenticationToken: token } })
                    .then(() => {
                        db.findOne({ username }, { password: 0 })
                            .then(updatedUser => res.send(updatedUser))
                            .catch(error => res.send({ error }));
                    })
                    .catch(error => res.send({ error }));
            } else {
                res.send({ error: 'Invalid username or password.' });
            }
        })
        .catch(error => res.send({ error }));
});

// create route to update user doc (PATCH /users/:username)
app.patch('/users/:username', (req, res) => {
    const { authenticationToken, ...updateData } = req.body;
    db.findOne({ username: req.params.username })
        .then(user => {
            if (user && user.authenticationToken && user.authenticationToken === authenticationToken) {
                try {
                    const decoded = jwt.verify(authenticationToken, JWT_SECRET);
                    if (decoded.username === req.params.username) {
                        // If password is being updated, hash it
                        if (updateData.password) {
                            updateData.password = bcrypt.hashSync(updateData.password, 10);
                        }
                        db.updateOne({ username: req.params.username }, { $set: updateData })
                            .then(numUpdated => {
                                if (numUpdated === 0) res.send({ error: 'Something went wrong.' });
                                else res.send({ ok: true });
                            })
                            .catch(error => res.send({ error }));
                    } else {
                        res.send({ error: 'Unauthorized.' });
                    }
                } catch (err) {
                    res.send({ error: 'Invalid token.' });
                }
            } else {
                res.send({ error: 'Unauthorized.' });
            }
        })
        .catch(error => res.send({ error }));
});

// create route to delete user doc (DELETE /users/:username)
app.delete('/users/:username', (req, res) => {
    const { authenticationToken } = req.body;
    db.findOne({ username: req.params.username })
        .then(user => {
            if (user && user.authenticationToken && user.authenticationToken === authenticationToken) {
                try {
                    const decoded = jwt.verify(authenticationToken, JWT_SECRET);
                    if (decoded.username === req.params.username) {
                        db.deleteOne({ username: req.params.username })
                            .then(numDeleted => {
                                if (numDeleted === 0) res.send({ error: 'Something went wrong.' });
                                else res.send({ ok: true });
                            })
                            .catch(error => res.send({ error }));
                    } else {
                        res.send({ error: 'Unauthorized.' });
                    }
                } catch (err) {
                    res.send({ error: 'Invalid token.' });
                }
            } else {
                res.send({ error: 'Unauthorized.' });
            }
        })
        .catch(error => res.send({ error }));
});

// create route to logout (POST /users/logout)
app.post('/users/logout', (req, res) => {
    const { username, authenticationToken } = req.body;
    db.findOne({ username })
        .then(user => {
            if (user && user.authenticationToken === authenticationToken) {
                db.updateOne({ username }, { $unset: { authenticationToken: "" } })
                    .then(() => res.send({ ok: true }))
                    .catch(error => res.send({ error }));
            } else {
                res.send({ error: 'Invalid token or username.' });
            }
        })
        .catch(error => res.send({ error }));
});


// default route
app.use((req, res) => { res.status(404).send('Invalid URL.') });

// start server
app.listen(3000,()=>console.log("Server started on http://localhost:3000"));
