document.addEventListener('DOMContentLoaded', () => {
    const missingDogForm = document.getElementById('missing-dog-form');
    const foundDogForm = document.getElementById('found-dog-form');
    const successMessage = document.getElementById('success-message');

    // Handle Missing Dog Form Submission
    missingDogForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const breed = document.getElementById('breed').value;
        const lastSeen = document.getElementById('last-seen').value;
        const photo = document.getElementById('missing-photo').files[0];

        const reader = new FileReader();
        reader.onloadend = () => {
            const photoData = reader.result;

            const missingDogData = {
                name: name,
                breed: breed,
                lastSeen: lastSeen,
                photo: photoData
            };

            // Send the data to the server using a POST request
            fetch('http://localhost:3000/api/missing-dogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(missingDogData)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);

                // Show success message
                successMessage.classList.remove('d-none');

                // Redirect to missing_furries.html after a delay
                setTimeout(() => {
                    window.location.href = 'missing_furries.html';
                }, 2000); // Adjust delay as needed
            })
            .catch(err => {
                console.error('Error:', err);
            });

            missingDogForm.reset();
        };

        if (photo) {
            reader.readAsDataURL(photo);
        } else {
            reader.onloadend();
        }
    });

    // Handle Found Dog Form Submission
    foundDogForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('found-name').value;
        const breed = document.getElementById('found-breed').value;
        const foundLocation = document.getElementById('found-location').value;
        const photo = document.getElementById('found-photo').files[0];

        const reader = new FileReader();
        reader.onloadend = () => {
            const photoData = reader.result;

            const foundDogData = {
                name: name,
                breed: breed,
                foundLocation: foundLocation,
                photo: photoData
            };

            // Send the data to the server using a POST request
            fetch('http://localhost:3000/api/found-dogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(foundDogData)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);

                // Show success message
                successMessage.classList.remove('d-none');

                // Redirect to found_furries.html after a delay
                setTimeout(() => {
                    window.location.href = 'found_furries.html';
                }, 2000); // Adjust delay as needed
            })
            .catch(err => {
                console.error('Error:', err);
            });

            foundDogForm.reset();
        };

        if (photo) {
            reader.readAsDataURL(photo);
        } else {
            reader.onloadend();
        }
    });
});
