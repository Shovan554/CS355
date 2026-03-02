const jsonInput = document.getElementById('jsonInput');
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

async function handleAction(endpoint) {
    const input = jsonInput.value.trim();
    if (!input) {
        displayResult({ error: 'Input is empty' }, true);
        return;
    }

    try {
        const body = JSON.parse(input);
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
        displayResult({ error: 'Invalid JSON or request failed: ' + err.message }, true);
    }
}

insertBtn.onclick = () => handleAction('/insert');
searchBtn.onclick = () => handleAction('/search');
