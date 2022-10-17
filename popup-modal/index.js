const openBtn = document.querySelector('button');
const closeBTn = document.querySelector('#close');
const modal = document.querySelector('.modal');
const form = document.querySelector('form');

openBtn.addEventListener('click', opneModal);

function opneModal(){
    modal.style.display = 'grid';
}

closeBTn.addEventListener('click', closeModal);
function closeModal(){
    modal.classList.add('close-modal-animation');
    setTimeout(() => {
        modal.style.display = 'none';
        window.location.reload();
    },500);
}


modal.addEventListener('click', function(e){
    if(e.target.classList.contains('modal')){
        closeModal();
    }
})


form.addEventListener('submit', submitForm);

function submitForm(){
    const card = document.querySelector('.card');
    card.innerHTML = "<h1>Thanks for your Subscription!</h1>";
    setTimeout(() => {
        closeModal();
    }, 3000);
}