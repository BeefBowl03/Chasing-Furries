document.addEventListener('DOMContentLoaded', () => {
    const missingDogForm = document.getElementById('missing-dog-form');
    const foundDogForm = document.getElementById('found-dog-form');
    const successMessage = document.getElementById('success-message');

    // Function to display success message and redirect
    const showSuccessMessage = (url) => {
        successMessage.classList.remove('d-none');
        setTimeout(() => {
            window.location.href = url;
        }, 2000);
    };

    // Function to display an error message
    const showError = (errorMessage) => {
        alert(errorMessage || 'There was an error submitting the form. Please try again.');
    };

    // Function to handle fetch requests
    const submitFormData = (url, formData, form) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            showSuccessMessage(url.includes('missing') ? 'missing_furries.html' : 'found_furries.html');
        })
        .catch(err => {
            console.error('Error:', err);
            showError(); // Display error message
        })
        .finally(() => {
            form.reset(); // Reset form regardless of success or failure
        });
    };

    // General function to handle form submission
    const handleFormSubmission = (form, url, dataCallback) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const photo = form.querySelector('input[type="file"]').files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                const photoData = reader.result;
                const formData = dataCallback(photoData);
                submitFormData(url, formData, form); // Submit form data after photo is read
            };

            if (photo) {
                reader.readAsDataURL(photo); // If there's a photo, read it
            } else {
                const formData = dataCallback(null); // Handle form submission without photo
                submitFormData(url, formData, form); // Submit form data without photo
            }
        });
    };

    // Handle Missing Dog Form Submission
    handleFormSubmission(missingDogForm, 'https://chasing-furries.onrender.com/api/missing-dogs', (photoData) => {
        return {
            name: document.getElementById('name').value,
            breed: document.getElementById('breed').value,
            lastSeen: document.getElementById('last-seen').value,
            photo: photoData,
        };
    });

    // Handle Found Dog Form Submission
    handleFormSubmission(foundDogForm, 'https://chasing-furries.onrender.com/api/found-dogs', (photoData) => {
        return {
            name: document.getElementById('found-name').value,
            breed: document.getElementById('found-breed').value,
            foundLocation: document.getElementById('found-location').value,
            photo: photoData,
        };
    });
});
