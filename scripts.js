document.addEventListener('DOMContentLoaded', () => {
    // Handle the missing dog form submission
    const missingDogForm = document.getElementById('missing-dog-form');
    missingDogForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const breed = document.getElementById('breed').value;
        const lastSeen = document.getElementById('last-seen').value;
        const photo = document.getElementById('missing-photo').files[0];

        const formData = new FormData();
        formData.append('name', name);
        formData.append('breed', breed);
        formData.append('lastSeen', lastSeen);
        if (photo) {
            formData.append('photo', photo);
        }

        try {
            const response = await fetch('https://chasing-furries.onrender.com/api/missing-dogs', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            document.getElementById('success-message').classList.remove('d-none');
            missingDogForm.reset(); // Reset the form

        } catch (error) {
            console.error('Error submitting the missing dog form:', error);
            alert('There was an error submitting the form. Please try again.');
        }
    });

    // Handle the found dog form submission (similar to the missing dog form)
    const foundDogForm = document.getElementById('found-dog-form');
    foundDogForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('found-name').value;
        const breed = document.getElementById('found-breed').value;
        const foundLocation = document.getElementById('found-location').value;
        const photo = document.getElementById('found-photo').files[0];

        const formData = new FormData();
        formData.append('name', name);
        formData.append('breed', breed);
        formData.append('foundLocation', foundLocation);
        if (photo) {
            formData.append('photo', photo);
        }

        try {
            const response = await fetch('https://chasing-furries.onrender.com/api/found-dogs', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            document.getElementById('success-message').classList.remove('d-none');
            foundDogForm.reset(); // Reset the form

        } catch (error) {
            console.error('Error submitting the found dog form:', error);
            alert('There was an error submitting the form. Please try again.');
        }
    });
});
