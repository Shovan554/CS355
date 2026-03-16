
const statusMsg = document.getElementById('status-message');
const resultsContainer = document.getElementById('results-container');
const searchInput = document.getElementById('search-input');
const jsonInput = document.getElementById('json-input');
const btnSearch = document.getElementById('btn-search');
const btnCreate = document.getElementById('btn-create');
const btnModalSubmit = document.getElementById('btn-modal-submit');
const btnModalCancel = document.getElementById('btn-modal-cancel');


searchInput.addEventListener('keydown',e=>{
    if(e.key === 'Enter'){
        handleSearch();
    }
});
btnSearch.addEventListener('click', handleSearch);
btnCreate.addEventListener('click', () => openModal('POST'));
btnModalCancel.addEventListener('click', closeModal);


// --- Modal Logic ---
function openModal(action, id = null, data = null) {
    document.getElementById('modal-title').innerText = `${action} Document ${id ? '('+id+')' : ''}`;
    document.getElementById('modal-overlay').style.display = 'flex';
    
    // Pre-fill jsonInput if data is provided
    if (data) {
        // Exclude _id from the editable JSON to prevent issues
        const { _id, ...editableData } = data;
        jsonInput.value = JSON.stringify(editableData, null, 2);
    } else {
        jsonInput.value = '';
    }

    if(action === 'PATCH'){
        btnModalSubmit.innerText = 'Update';
        btnModalSubmit.onclick = ()=>{
            handleUpdate(id, jsonInput.value);
            closeModal();
        }
    }else if(action === 'PUT'){
        btnModalSubmit.innerText = 'Replace';
        btnModalSubmit.onclick = ()=>{
            handleReplace(id, jsonInput.value);
            closeModal();
        }
    }else{
        btnModalSubmit.innerText = 'Create';
        btnModalSubmit.onclick = ()=>{
            handleCreate(jsonInput.value);
            closeModal();
        }
    }
}

function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
    document.getElementById('json-input').value = '';
}

function showStatus(msg) {
    statusMsg.innerText = msg;
    statusMsg.className = '';
}

function showSuccess(msg) {
    statusMsg.innerText = msg;
    statusMsg.className = 'success';
}

function showError(msg){
    statusMsg.innerText = msg;
    statusMsg.className = 'error';
}


// --- Show Documents ---

function showDocument(doc){
    if(!doc?._id)return;
    let div = document.getElementById(doc._id);
    if(div){
        div.innerHTML = '';
    }else{
        div = document.createElement('div');
        div.className = 'doc-card';
        div.id = doc._id;
        resultsContainer.appendChild(div);
    }
    // data
    const docContent = document.createElement('div');
    docContent.className = 'doc-data';
    docContent.innerText = JSON.stringify(doc, null, 2);
    div.appendChild(docContent);
    // update button
    const patchBtn = document.createElement('button');
    patchBtn.innerText = 'Edit';
    patchBtn.addEventListener('click', () => openModal('PATCH', doc._id, doc));
    div.appendChild(patchBtn);
    // replace button
    const putBtn = document.createElement('button');
    putBtn.innerText = 'Replace';
    putBtn.addEventListener('click', () => openModal('PUT', doc._id, doc));
    div.appendChild(putBtn);
    // delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.classList.add('btn-danger');
    deleteBtn.addEventListener('click', () => handleDelete(doc._id));
    div.appendChild(deleteBtn);
}

function showDocuments(docs) {
    resultsContainer.innerHTML = '';
    docs.forEach(showDocument);
}



async function handleSearch() {
    // find document in DB and display them
    const query = searchInput.value.trim();
    showStatus('Searching...');
    try {
        const url = `/data?q=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Failed to fetch documents');
        }
        const docs = await response.json();
        showDocuments(docs);
        showSuccess(`Found ${docs.length} document(s) matching query.`);
    } catch (err) {
        showError(err.message);
    }
}

async function handleCreate(rawJson){
    // create a new document in DB
    showStatus('Creating document...');
    try {
        const response = await fetch('/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: rawJson
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Failed to create document');
        }
        const doc = await response.json();
        showDocument(doc);
        showSuccess('Document created successfully');
    } catch (err) {
        showError(err.message);
    }
}

async function handleUpdate(id, rawJson){
    // update an existing document in DB (PATCH)
    showStatus('Updating document...');
    try {
        const response = await fetch(`/data/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: rawJson
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Failed to update document');
        }
        const doc = await response.json();
        showDocument(doc);
        showSuccess('Document updated successfully');
    } catch (err) {
        showError(err.message);
    }
}

async function handleReplace(id, rawJson){
    // replace an existing document in DB (PUT)
    showStatus('Replacing document...');
    try {
        const response = await fetch(`/data/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: rawJson
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Failed to replace document');
        }
        const doc = await response.json();
        showDocument(doc);
        showSuccess('Document replaced successfully');
    } catch (err) {
        showError(err.message);
    }
}

async function handleDelete(id) {
    // delete a document from DB
    if(confirm(`Are you sure you want to delete document with ID ${id}?`)) {
        showStatus('Deleting document...');
        try {
            const response = await fetch(`/data/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to delete document');
            }
            const div = document.getElementById(id);
            if (div) div.remove();
            showSuccess(`Deleted document with ID: ${id}`);
        } catch (err) {
            showError(err.message);
        }
    }
}
