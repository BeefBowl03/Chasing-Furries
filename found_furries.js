document.addEventListener('DOMContentLoaded', () => {
    const foundDogList = document.getElementById('found-dog-list');
    const searchBar = document.getElementById('search-bar');
    const ownerModal = document.getElementById('owner-modal');
    const confirmOwnerButton = document.getElementById('confirm-owner');
    let currentIndex;

    // Load and display found dogs from localStorage
    const displayFoundDogs = () => {
        const foundDogs = JSON.parse(localStorage.getItem('foundDogs')) || [];
        foundDogList.innerHTML = '';
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

    displayFoundDogs();

    // Handle search functionality
    searchBar.addEventListener('input', () => {
        const searchTerm = searchBar.value.toLowerCase();
        const foundDogs = JSON.parse(localStorage.getItem('foundDogs')) || [];
        const filteredDogs = foundDogs.filter(dog => 
            dog.name.toLowerCase().includes(searchTerm) || 
            dog.breed.toLowerCase().includes(searchTerm)
        );
        foundDogList.innerHTML = '';
        filteredDogs.forEach((dog, index) => {
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
    });

    // Handle "I'm the Owner" button clicks
    foundDogList.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-secondary')) {
            currentIndex = e.target.getAttribute('data-index');
        }
    });

    // Confirm ownership
    confirmOwnerButton.addEventListener('click', () => {
        if (currentIndex !== undefined) {
            let foundDogs = JSON.parse(localStorage.getItem('foundDogs')) || [];
            foundDogs.splice(currentIndex, 1);
            localStorage.setItem('foundDogs', JSON.stringify(foundDogs));
            $('#owner-modal').modal('hide');
            displayFoundDogs();
        }
    });
});
