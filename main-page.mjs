// script for modal handiling

const openModal =  document.getElementById('OpenModal')
const closeModal = document.getElementById('CloseModal')
const loginModal = document.getElementById('loginModal')

openModal.addEventListener('click', function() {
    event.preventDefault();
    loginModal.showModal();
});

closeModal.addEventListener('click', function() {
    loginModal.close();
});
