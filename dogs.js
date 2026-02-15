const breedInput = document.getElementById('breedInput');
const breedsDatalist = document.getElementById('breeds');
const showImagesBtn = document.getElementById('showImagesBtn');
const statusMessage = document.getElementById('statusMessage');
const imageContainer = document.getElementById('imageContainer');

let intervalId = null;
let allBreeds = [];

//fetching all breeds
async function init() {
    try {
        const response = await fetch('https://dog.ceo/api/breeds/list/all');
        const data = await response.json();
        const breedData = data.message;
        
        allBreeds = [];
        for (const breed in breedData) {
            allBreeds.push(breed);
            if (breedData[breed].length > 0) {
                breedData[breed].forEach(subBreed => {
                    allBreeds.push(`${breed} ${subBreed}`);
                });
            }
        }
        
        allBreeds.sort().forEach(breed => {
            const option = document.createElement('option');
            option.value = breed;
            breedsDatalist.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching breeds:', error);
    }
}

async function showRandomImage(breed) {
    
    const apiBreed = breed.replace(' ', '/');
    try {
        const response = await fetch(`https://dog.ceo/api/breed/${apiBreed}/images/random`);
        const data = await response.json();
        
        if (data.status === 'success') {
            statusMessage.textContent = '';
            imageContainer.innerHTML = `<img src="${data.message}" alt="${breed}">`;
        } else {
            handleError();
        }
    } catch (error) {
        handleError();
    }
}

function handleError() {
    statusMessage.textContent = 'No such breed';
    imageContainer.innerHTML = '';
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

showImagesBtn.addEventListener('click', () => {
    const breed = breedInput.value.toLowerCase().trim();
    
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }

    if (allBreeds.includes(breed)) {
        showRandomImage(breed);
        intervalId = setInterval(() => showRandomImage(breed), 5000);
    } else {
        handleError();
    }
});

init();
