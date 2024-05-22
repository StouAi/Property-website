export function handleCatchphraseChange() {
    const catchphraseElem = document.querySelector('.catchphrase h1');
    const buyRadio = document.getElementById('buy');
    const rentRadio = document.getElementById('rent');
    console.log("yay")
    buyRadio.addEventListener('change', function() {
        catchphraseElem.textContent = "Αγορά";
    });

    rentRadio.addEventListener('change', function() {
        catchphraseElem.textContent = "Ενοικίαση";
    });
}
