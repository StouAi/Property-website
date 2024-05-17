document.addEventListener('DOMContentLoaded', function() {
    function updateButtonText(menuSelector, buttonSelector) {
        const menuItems = document.querySelectorAll(menuSelector + ' a');
        const button = document.querySelector(buttonSelector);
        

        menuItems.forEach(item => {
            item.addEventListener('click', function (event) {
                event.preventDefault();
                button.textContent = this.textContent; // Update the button text
            });
        });
    }

    // Update button text for type and sale menus
    updateButtonText('.type-menu', '#typeButton');
    updateButtonText('.sale-menu', '#saleButton');
});

    
