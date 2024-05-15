document.getElementById('type').addEventListener('click', function(event) {
    event.stopPropagation(); // Prevent the event from bubbling up
    this.classList.toggle('active');
});

document.querySelectorAll('.type-menu li a').forEach(function(item) {
    item.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default link behavior
        let selectedType = this.getAttribute('data-type');
        document.getElementById('type').textContent = selectedType;
        document.getElementById('type').classList.remove('active');
    });
});

// Close the dropdown if the user clicks outside of it
document.addEventListener('click', function(event) {
    var typeButton = document.getElementById('type');
    if (!typeButton.contains(event.target)) {
        typeButton.classList.remove('active');
    }
});
