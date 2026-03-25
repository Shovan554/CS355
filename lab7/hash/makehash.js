const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const password = process.argv[2];

if (!password) {
    console.error("Please provide a password.");
    process.exit(1);
}

const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error(err);
        return;
    }
    fs.writeFileSync('password.txt', hash);
});
