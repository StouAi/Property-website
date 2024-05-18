document.addEventListener('DOMContentLoaded', function() {
    const openModal = document.getElementById('OpenModal');
    const closeModalButtons = document.getElementsByClassName('CloseModal');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const contButton = document.getElementById('contBtn');
    const backButton = document.getElementById('BackBtn'); // Fixed the method to get a single element
    const emailInput = document.getElementById('emailInput');
    const emailWarning = document.getElementById('emailWarning');

    openModal.addEventListener('click', function(event) {
        event.preventDefault();
        loginModal.showModal();
    });

    // Add event listeners to all CloseModal buttons
    Array.from(closeModalButtons).forEach(button => {
        button.addEventListener('click', function() {
            loginModal.close();
            registerModal.close();
        });
    });

    // Add event listener to continue button if it exists
    if (contButton) {
        contButton.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent form submission

            // Validate email input
            if (emailInput.value.trim() === '') {
                emailWarning.style.display = 'block';
            } else {
                emailWarning.style.display = 'none';
                loginModal.close();
                registerModal.showModal();
            }
        });
    }

    // Add event listener to back button if it exists
    if (backButton) {
        backButton.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent form submission
            registerModal.close();
            loginModal.showModal();
        });
    }
});
