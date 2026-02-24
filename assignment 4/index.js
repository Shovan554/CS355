const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

const imgPath = path.join(__dirname, 'public', 'img');

const breedData = {};
const breedFolders = fs.readdirSync(imgPath).filter(file => {
    return fs.statSync(path.join(imgPath, file)).isDirectory();
});

breedFolders.forEach(breed => {
    const images = fs.readdirSync(path.join(imgPath, breed)).filter(file => {
        return /\.(jpg|jpeg|png|gif)$/i.test(file);
    });
    breedData[breed] = images;
});

const allBreeds = Object.keys(breedData);

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getRandomItem(array) {
    return array[getRandomInt(array.length)];
}

app.get('/breeds', (req, res) => {
    res.json(allBreeds);
});

app.get('/image/:breed', (req, res) => {
    const breed = req.params.breed.toLowerCase();
    if (breedData[breed] && breedData[breed].length > 0) {
        const randomImage = getRandomItem(breedData[breed]);
        res.json({
            status: 'success',
            message: `/img/${breed}/${randomImage}`
        });
    } else {
        res.status(404).json({
            status: 'error',
            message: 'Breed not found'
        });
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
