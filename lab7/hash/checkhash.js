const bcrypt = require('bcrypt');
const fs = require('fs');

const password = process.argv[2];

if (!password) {
    console.error("Please provide a password.");
    process.exit(1);
}

if (!fs.existsSync('password.txt')) {
    console.error("password.txt not found.");
    process.exit(1);
}

const hash = fs.readFileSync('password.txt', 'utf8').trim();

bcrypt.compare(password, hash, (err, result) => {
    if (result) {
        console.log("Match successful");
    } else {
        console.log("Invalid password");
    }
});
