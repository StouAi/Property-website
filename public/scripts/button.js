document.addEventListener('DOMContentLoaded', () => {
    const favouriteButton = document.getElementById('favoriteBtn');

    favouriteButton.addEventListener('click', () => {
        if (favouriteButton.classList.contains('added')) {
            // Revert to original state
            favouriteButton.innerHTML = '<i class="fa fa-heart"></i> Add to Favourites';
            favouriteButton.classList.remove('added');
        } else {
            // Change to added state
            favouriteButton.innerHTML = '<i class="fa fa-heart"></i> Added';
            favouriteButton.classList.add('added');
        }
    });
});



document.addEventListener('DOMContentLoaded', () => {
    const priceBtn = document.getElementById('price-btn');
    const priceMenu = document.getElementById('price-menu');
    const surfaceBtn = document.getElementById('surface-btn');
    const surfaceMenu = document.getElementById('surface-menu');
    
    // Helper function to toggle display
    const toggleDisplay = (menu) => {
        if (menu.style.display === 'none' || !menu.style.display) {
            menu.style.display = 'flex';
        } else {
            menu.style.display = 'none';
        }
    };

    priceBtn.addEventListener('click', (event) => {
        event.preventDefault();
        
        toggleDisplay(priceMenu);
    });

    surfaceBtn.addEventListener('click', (event) => {
        event.preventDefault();
        
        toggleDisplay(surfaceMenu);
    });

  

});