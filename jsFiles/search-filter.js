document.addEventListener('DOMContentLoaded', function() {
    function updateButtonText(menuSelector, buttonSelector) {
        const menuItems = document.querySelectorAll(menuSelector + ' a');
        const button = document.querySelector(buttonSelector);

        menuItems.forEach(item => {
            item.addEventListener('click', function (event) {
                event.preventDefault();
                button.textContent = this.textContent.trim(); // Update the button text

                // If the button is typeButton, update the subtype menu
                if (buttonSelector === '#typeButton') {
                    updateSubtypeMenu(this.textContent.trim());
                }
            });
        });
    }

    function updateSubtypeMenu(type) {
        const subtypeMenu = document.querySelector('.subtype-menu');
        subtypeMenu.innerHTML = ''; // Clear the menu

        if (type === 'Κατοικία') {
            subtypeMenu.innerHTML = `
                <li><a href="#">Μονοκατοικία</a></li>
                <li><a href="#">Διαμέρισμα</a></li>
                <li><a href="#">Στούντιο</a></li>
                <li><a href="#">Μεζονέτα</a></li>
            `;
        } else if (type === 'Επαγγελματικό') {
            subtypeMenu.innerHTML = `
                <li><a href="#">Κατάστημα</a></li>
                <li><a href="#">Γραφείο</a></li>
                <li><a href="#">Αποθήκη</a></li>
            `;
        } else if (type === 'Οικόπεδο') {
            subtypeMenu.innerHTML = `
                <li><a href="#">Οικόπεδο</a></li>
                <li><a href="#">Αγροτεμάχιο</a></li>
            `;
        }
        // Reattach event listeners to new items
        updateButtonText('.subtype-menu', '#subtypeButton');
    }

    // Update button text for type, sale, and subtype menus
    updateButtonText('.type-menu', '#typeButton');
    updateButtonText('.sale-menu', '#saleButton');
    updateButtonText('.subtype-menu', '#subtypeButton');

    // Show/hide subtype menu on hover
    const subtypeContainer = document.querySelector('.subtype-type');

    subtypeContainer.addEventListener('mouseover', function() {
        document.querySelector('.subtype-menu').style.display = 'block';
    });

    subtypeContainer.addEventListener('mouseout', function() {
        document.querySelector('.subtype-menu').style.display = 'none';
    });
});
