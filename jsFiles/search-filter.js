document.addEventListener('DOMContentLoaded', function() {
    const typeSelect = document.getElementById('typeSelect');
    const subtypeSelect = document.getElementById('subtypeSelect');
    const saleSelect = document.getElementById('saleSelect');
    const priceMinInput = document.querySelector('.price-input .input-min');
    const priceMaxInput = document.querySelector('.price-input .input-max');
    const areaMinInput = document.querySelector('.area-input .input-min');
    const areaMaxInput = document.querySelector('.area-input .input-max');
    
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
