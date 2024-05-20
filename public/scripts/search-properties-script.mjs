document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM filters loaded');

    const typeSelect = document.getElementById('typeSelect');
    const subtypeSelect = document.getElementById('subtypeSelect');
    const saleSelect = document.getElementById('saleSelect');
    const priceMinInput = document.querySelector('.price-input .input-min');
    const priceMaxInput = document.querySelector('.price-input .input-max');
    const areaMinInput = document.querySelector('.area-input .input-min');
    const areaMaxInput = document.querySelector('.area-input .input-max');
    

    // Define additional filter options
    const additionalFilterOptions = {
        'residential': `
            <div class="filter-group">
                <label for="floorMin">Όροφος</label>
                <input type="number" id="floorMin" name="property[minFloor]" value="null" placeholder="Ελάχιστος">
                <span>-</span>
                <input type="number" id="floorMax" name="property[maxFloor]" value="null" placeholder="Μέγιστος">
            </div>

            <div class="filter-group">
                <label for="levelsMin">Αριθμός Ορόφων</label>
                <input type="number" id="levelsMin" name="property[minLevels]" value="null" placeholder="Ελάχιστος">
                <span>-</span>
                <input type="number" id="levelsMax" name="property[maxLevels]" value="null" placeholder="Μέγιστος">
            </div>

            <div class="filter-group">
                <label for="bedroomsMin">Αριθμός Υπνοδωματίων</label>
                <input type="number" id="bedroomsMin" name="property[minBedrooms]" value="null" placeholder="Ελάχιστος">
                <span>-</span>
                <input type="number" id="bedroomsMax" name="property[maxBedrooms]" value="null" placeholder="Μέγιστος">
            </div>

            <div class="filter-group">
                <label for="bathroomsMin">Αριθμός μπάνιων</label>
                <input type="number" id="bathroomsMin" name="property[minBathrooms]" value="null" placeholder="Ελάχιστος">
                <span>-</span>
                <input type="number" id="bathroomsMax" name="property[maxBathrooms]" value="null" placeholder="Μέγιστος">
            </div>
        `,
        'commercial': `
            <div class="filter-group">
                <label for="floorMin">Όροφος</label>
                <input type="number" id="floorMin" name="property[minFloor]" value="null" placeholder="Ελάχιστος">
                <span>-</span>
                <input type="number" id="floorMax" name="property[maxFloor]" value="null" placeholder="Μέγιστος">
            </div>

            <div class="filter-group">
                <label for="levelsMin">Αριθμός Ορόφων</label>
                <input type="number" id="levelsMin" name="property[minLevels]" value="null" placeholder="Ελάχιστος">
                <span>-</span>
                <input type="number" id="levelsMax" name="property[maxLevels]" value="null" placeholder="Μέγιστος">
            </div>

            <div class="filter-group">
                <label for="bathroomsMin">Αριθμός μπάνιων</label>
                <input type="number" id="bathroomsMin" name="property[minBathrooms]" value="null" placeholder="Ελάχιστος">
                <span>-</span>
                <input type="number" id="bathroomsMax" name="property[maxBathrooms]" value="null" placeholder="Μέγιστος">
            </div>
        `,
        'land': `
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
        
        if (type === 'residential') {
            subtypeSelect.innerHTML = `
                <option value="">Όλα</option>
                <option value="Μονοκατοικία">Μονοκατοικία</option>
                <option value="Διαμέρισμα">Διαμέρισμα</option>
                <option value="Στούντιο">Στούντιο</option>
                <option value="Μεζονέτα">Μεζονέτα</option>
            `;
        } else if (type === 'commercial') {
            subtypeSelect.innerHTML = `
                <option value="">Όλα</option>
                <option value="Κατάστημα">Κατάστημα</option>
                <option value="Γραφείο">Γραφείο</option>
                <option value="Αποθήκη">Αποθήκη</option>
            `;
        }
        // else if (type === 'land') {
        //     subtypeSelect.innerHTML = `
        //         <option value="Όλα">Όλα</option>
        //         <option value="Οικόπεδο">Οικόπεδο</option>
        //         <option value="Αγροτεμάχιο">Αγροτεμάχιο</option>
        //     `;
        // }
        else {
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

});