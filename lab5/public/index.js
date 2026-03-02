const insertInput = document.getElementById('insertInput');
const searchInput = document.getElementById('searchInput');
const insertBtn = document.getElementById('insertBtn');
const searchBtn = document.getElementById('searchBtn');
const resultsArea = document.getElementById('results');

function displayResult(data, isError = false) {
    resultsArea.innerHTML = '';
    if (isError) {
        resultsArea.classList.add('error');
    } else {
        resultsArea.classList.remove('error');
    }
    resultsArea.textContent = JSON.stringify(data, null, 2);
}

async function handleAction(endpoint, inputElement) {
    const input = inputElement.value.trim();
    
    let body;
    if (!input) {
        if (endpoint === '/search') {
            body = {};
        } else {
            displayResult({ error: 'Insert input is empty' }, true);
            return;
        }
    } else {
        try {
            body = JSON.parse(input);
        } catch (err) {
            displayResult({ error: 'Invalid JSON: ' + err.message }, true);
            return;
        }
    }

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const result = await response.json();
        if (!response.ok) {
            displayResult(result, true);
        } else {
            displayResult(result);
        }
    } catch (err) {
        displayResult({ error: 'Request failed: ' + err.message }, true);
    }
}

insertBtn.onclick = () => handleAction('/insert', insertInput);
searchBtn.onclick = () => handleAction('/search', searchInput);
