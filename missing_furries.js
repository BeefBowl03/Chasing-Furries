document.addEventListener('DOMContentLoaded', () => {
    const missingDogList = document.getElementById('missing-dog-list');
    const searchBar = document.getElementById('search-bar');
    const reportFoundModal = document.getElementById('report-found-modal');
    const reportFoundForm = document.getElementById('report-found-form');
    const reportFoundName = document.getElementById('found-name');
    const reportFoundBreed = document.getElementById('found-breed');
    const reportFoundLocation = document.getElementById('found-location');
    const reportFoundPhoto = document.getElementById('found-photo');
    let currentIndex;

    // Load and display missing dogs from API
    const displayMissingDogs = (missingDogs) => {
        missingDogList.innerHTML = '';
        if (missingDogs.length === 0) {
            missingDogList.innerHTML = '<p>No missing dogs found.</p>';
            return;
        }
        missingDogs.forEach((dog, index) => {
            const listItem = document.createElement('div');
            listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

            const content = document.createElement('div');
            content.innerHTML = `
                <h5>${dog.name}</h5>
                <p>Breed: ${dog.breed}</p>
                <p>Last Seen: ${dog.lastSeen}</p>
                ${dog.photo ? `<img src="${dog.photo}" alt="Dog photo" class="img-thumbnail" style="width: 100px; height: auto;">` : ''}
            `;

            const actions = document.createElement('div');
            actions.innerHTML = `
                <button class="btn btn-primary btn-sm" data-index="${index}" data-toggle="modal" data-target="#report-found-modal">Report as Found</button>
            `;

            listItem.appendChild(content);
            listItem.appendChild(actions);
            missingDogList.appendChild(listItem);
        });
    };

    // Fetch missing dogs from the API
    const fetchMissingDogs = async () => {
        try {
            const response = await fetch('https://chasing-furries.onrender.com/api/missing-dogs');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json(); // Return data for filtering
        } catch (err) {
            console.error('Error fetching missing dogs:', err);
            return []; // Return an empty array on error
        }
    };

    // Initialize by fetching missing dogs
    const init = async () => {
        const missingDogs = await fetchMissingDogs();
        displayMissingDogs(missingDogs);
    };

    init();

    // Handle search functionality
    searchBar.addEventListener('input', async () => {
        const searchTerm = searchBar.value.toLowerCase();
        const missingDogs = await fetchMissingDogs(); // Fetch dogs each time for updated data
        const filteredDogs = missingDogs.filter(dog =>
            dog.name.toLowerCase().includes(searchTerm) ||
            dog.breed.toLowerCase().includes(searchTerm)
        );
        displayMissingDogs(filteredDogs);
    });

    // Handle "Report as Found" button clicks
    missingDogList.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-primary')) {
            currentIndex = e.target.getAttribute('data-index');
            const missingDogs = JSON.parse(localStorage.getItem('missingDogs')) || [];
            const dog = missingDogs[currentIndex];
            reportFoundName.value = dog.name;
            reportFoundBreed.value = dog.breed;
            reportFoundLocation.value = ''; // Empty field for location
            reportFoundPhoto.value = ''; // Empty field for photo
        }
    });

    // Handle "Report as Found" form submission
    reportFoundForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (currentIndex !== undefined) {
            const foundDog = {
                name: reportFoundName.value,
                breed: reportFoundBreed.value,
                foundLocation: reportFoundLocation.value,
                photo: reportFoundPhoto.files.length > 0 ? await uploadPhoto(reportFoundPhoto.files[0]) : ''
            };

            try {
                const response = await fetch('https://chasing-furries.onrender.com/api/found-dogs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(foundDog)
                });
                if (response.ok) {
                    // Remove the missing dog from the database
                    await fetch(`https://chasing-furries.onrender.com/api/missing-dogs/${currentIndex}`, {
                        method: 'DELETE'
                    });
                    $('#report-found-modal').modal('hide');
                    displayMissingDogs(await fetchMissingDogs());
                } else {
                    console.error('Failed to report found dog.');
                }
            } catch (err) {
                console.error('Error reporting found dog:', err);
            }
        }
    });
});
