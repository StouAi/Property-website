document.addEventListener('DOMContentLoaded', function() {
    const typeSelect = document.getElementById('typeSelect');
    const subtypeSelect = document.getElementById('subtypeSelect');
    const saleSelect = document.getElementById('saleSelect');
    const priceMinInput = document.querySelector('.price-input .input-min');
    const priceMaxInput = document.querySelector('.price-input .input-max');
    const areaMinInput = document.querySelector('.area-input .input-min');
    const areaMaxInput = document.querySelector('.area-input .input-max');
    

    // Define additional filter options
    const additionalFilterOptions = {
        'Κατοικία': `
            <div class="filter-group">
                <label for="floorsMin">Αριθμός Ορόφων</label>
                <input type="number" id="floorsMin" name="floorsMin" value="null" placeholder="Ελάχιστος">
                <span>-</span>
                <input type="number" id="floorsMax" name="floorsMax" value="null" placeholder="Μέγιστος">
            </div>

            <div class="filter-group">
                <label for="bedroomsMin"Αριθμός Υπνοδωματίων</label>
                <input type="number" id="bedroomsMin" name="bedroomsMin" value="null" placeholder="Ελάχιστος">
                <span>-</span>
                <input type="number" id="bedroomsMax" name="bedroomsMax" value="null" placeholder="Μέγιστος">
            </div>

            <div class="filter-group">
                <label for="bathroomsMin">Αριθμός μπάνιων</label>
                <input type="number" id="bathroomsMin" name="bathroomsMin" value="null" placeholder="Ελάχιστος">
                <span>-</span>
                <input type="number" id="bathroomsMax" name="bathroomsMax" value="null" placeholder="Μέγιστος">
        `,
        'Επαγγελματικό': `
            <div class="filter-group">
                <label for="roomsMin">Αριθμός Δωματίων</label>
                <input type="number" id="roomsMin" name="roomsMin" value="null" placeholder="Ελάχιστος">
                <span>-</span>
                <input type="number" id="roomsMax" name="roomsMax" value="null" placeholder="Μέγιστος">
            </div>
        `,
        'Γη': `
            <div class="filter-group">
                <label for="buildable">Οικοδομίσιμο</label>
                <input type="checkbox" id="buildable" name="buildable">
            </div>
           
        `
    };

    
    // Update subtype options based on type selection
    typeSelect.addEventListener('change', function() {
        const type = typeSelect.value;
        subtypeSelect.innerHTML = ''; // Clear existing options
        
        if (type === 'Κατοικία') {
            subtypeSelect.innerHTML = `
                <option value="Όλα">Όλα</option>
                <option value="Μονοκατοικία">Μονοκατοικία</option>
                <option value="Διαμέρισμα">Διαμέρισμα</option>
                <option value="Στούντιο">Στούντιο</option>
                <option value="Μεζονέτα">Μεζονέτα</option>
            `;
        } else if (type === 'Επαγγελματικό') {
            subtypeSelect.innerHTML = `
                <option value="Όλα">Όλα</option>
                <option value="Κατάστημα">Κατάστημα</option>
                <option value="Γραφείο">Γραφείο</option>
                <option value="Αποθήκη">Αποθήκη</option>
            `;
        } else if (type === 'Γη') {
            subtypeSelect.innerHTML = `
                <option value="Όλα">Όλα</option>
                <option value="Οικόπεδο">Οικόπεδο</option>
                <option value="Αγροτεμάχιο">Αγροτεμάχιο</option>
            `;
        } else {
            subtypeSelect.innerHTML = `
                <option value="">Επιλέξτε κατηγορία</option>
            `;
        }
    });


    filtersBtn.addEventListener('click', function() {
        const selectedType = typeSelect.value;
        if (additionalFilters.style.display === 'flex') {
            additionalFilters.style.display = 'none';
        } else {
            additionalFilters.innerHTML = additionalFilterOptions[selectedType] || '';
            additionalFilters.style.display = additionalFilters.innerHTML ? 'flex' : 'none';
        }
    });

    // Add submit event listener to the form
    const searchForm = document.querySelector('.search-filters');
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Collect form data
        const formData = new FormData(searchForm);
        const searchData = {
            location: formData.get('location'),
            type: formData.get('type'),
            subtype: formData.get('subtype'),
            sale: formData.get('sale'),
            priceMin: formData.get('priceMin'),
            priceMax: formData.get('priceMax'),
            areaMin: formData.get('areaMin'),
            areaMax: formData.get('areaMax')
        };

        console.log(searchData);

        // Here you can perform your search with the collected data
        // For example, send a request to your server or filter results on the page
    });
});
