document.addEventListener('DOMContentLoaded', () => {
    const foundDogList = document.getElementById('found-dog-list');
    const searchBar = document.getElementById('search-bar');
    const ownerModal = document.getElementById('owner-modal');
    const confirmOwnerButton = document.getElementById('confirm-owner');
    let currentIndex;

    // Load and display found dogs from the API
    const displayFoundDogs = (foundDogs) => {
        foundDogList.innerHTML = '';
        if (foundDogs.length === 0) {
            foundDogList.innerHTML = '<p>No found dogs available.</p>';
            return;
        }
        foundDogs.forEach((dog, index) => {
            const listItem = document.createElement('div');
            listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

            const content = document.createElement('div');
            content.innerHTML = `
                <h5>${dog.name}</h5>
                <p>Breed: ${dog.breed}</p>
                <p>Found Location: ${dog.foundLocation}</p>
                ${dog.photo ? `<img src="${dog.photo}" alt="Dog photo" class="img-thumbnail" style="width: 100px; height: auto;">` : ''}
            `;

            const actions = document.createElement('div');
            actions.innerHTML = `
                <button class="btn btn-secondary btn-sm" data-index="${index}" data-toggle="modal" data-target="#owner-modal">I'm the Owner</button>
            `;

            listItem.appendChild(content);
            listItem.appendChild(actions);
            foundDogList.appendChild(listItem);
        });
    };

    // Fetch found dogs from the API
    const fetchFoundDogs = async () => {
        try {
            const response = await fetch('https://chasing-furries.onrender.com/api/found-dogs');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            displayFoundDogs(data);
        } catch (err) {
            console.error('Error fetching found dogs:', err);
        }
    };

    fetchFoundDogs();

    // Handle search functionality
    searchBar.addEventListener('input', async () => {
        const searchTerm = searchBar.value.toLowerCase();
        const foundDogs = await fetchFoundDogs(); // Fetch dogs for updated data
        const filteredDogs = foundDogs.filter(dog =>
            dog.name.toLowerCase().includes(searchTerm) ||
            dog.breed.toLowerCase().includes(searchTerm)
        );
        displayFoundDogs(filteredDogs);
    });

    // Handle "I'm the Owner" button clicks
    foundDogList.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-secondary')) {
            currentIndex = e.target.getAttribute('data-index');
        }
    });

    // Confirm ownership
    confirmOwnerButton.addEventListener('click', async () => {
        if (currentIndex !== undefined) {
            try {
                const response = await fetch('https://chasing-furries.onrender.com/api/found-dogs', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ index: currentIndex }) // Send the index of the found dog to be removed
                });
                if (response.ok) {
                    $('#owner-modal').modal('hide');
                    fetchFoundDogs(); // Refresh the list of found dogs
                } else {
                    console.error('Failed to confirm ownership.');
                }
            } catch (err) {
                console.error('Error confirming ownership:', err);
            }
        }
    });
});
