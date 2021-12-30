// This function checks the login credentials
// It takes no input in
// Will display an error is the credentials are wrong
function login() {
    
    // Get the username input
    var uname = $("#uname").val()

    // Get the password input
    var pword = $("#psw").val()

    // Hash both.

    // Check against credentials

    // Animating out the login screen
    login_page = document.querySelector('.login_page')

    login_page.classList.add("animate__animated", "animate__bounceOutUp")

    home = document.querySelector('.home')
    home.style.visibility = "visible"
    home.classList.add("animate__animated", "animate__slideInLeft"); 


    // $(".login_page").removeClass("animate__bounceOutUp");$(".login_page").addClass("animate__bounceInRight") <Log out animation
    // ^ Ajay will fix this later
    
}

async function loaddrone() {
    // console.log('Taking a break...');
    // await new Promise(r => setTimeout(r, 2000));
    // console.log('Two seconds later, showing sleep in a loop...');

    // load animations
    content = document.querySelector('.contentbox')
    
    content.style.visibility = "visible"

    content.classList.add("animate__animated","animate__slideInRight")

    content.addEventListener('animationend', () => {
        content.classList.remove("animate__animated","animate__slideInRight")
    });


}


function camsize() {

    $(".cam").css("width", $(".cam").height());
}

window.addEventListener('resize', camsize);

$(document).ready(function() {
    $(".cam").css("width", $(".cam").height());
});