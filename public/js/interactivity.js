

const searchUserInput = document.querySelector(".searchUser");

searchUserInput.addEventListener('input' , (event) =>{
    const suggestionsBox = document.querySelector(".suggestions");
    suggestionsBox.textContent = event.target.value;


})