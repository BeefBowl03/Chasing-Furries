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
            const data = await response.json();
            displayMissingDogs(data);
        } catch (err) {
            console.error('Error fetching missing dogs:', err);
        }
    };

    fetchMissingDogs();

    // Handle search functionality
    searchBar.addEventListener('input', () => {
        const searchTerm = searchBar.value.toLowerCase();
        fetchMissingDogs().then((missingDogs) => {
            const filteredDogs = missingDogs.filter(dog =>
                dog.name.toLowerCase().includes(searchTerm) ||
                dog.breed.toLowerCase().includes(searchTerm)
            );
            displayMissingDogs(filteredDogs);
        });
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
    reportFoundForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (currentIndex !== undefined) {
            const foundDog = {
                name: reportFoundName.value,
                breed: reportFoundBreed.value,
                foundLocation: reportFoundLocation.value,
                photo: reportFoundPhoto.files.length > 0 ? URL.createObjectURL(reportFoundPhoto.files[0]) : ''
            };
            let foundDogs = JSON.parse(localStorage.getItem('foundDogs')) || [];
            foundDogs.push(foundDog);
            localStorage.setItem('foundDogs', JSON.stringify(foundDogs));

            // Remove the missing dog from localStorage
            let missingDogs = JSON.parse(localStorage.getItem('missingDogs')) || [];
            missingDogs.splice(currentIndex, 1);
            localStorage.setItem('missingDogs', JSON.stringify(missingDogs));
            $('#report-found-modal').modal('hide');
            displayMissingDogs(missingDogs);
        }
    });
});
