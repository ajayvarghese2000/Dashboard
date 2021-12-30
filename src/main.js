// This function checks the login credentials
// It takes  in no input
// Will display an error is the credentials are wrong
function login() {

    // Get the username input
    var uname = $("#uname").val()

    // Get the password input
    var pword = $("#psw").val()

    // Hash both.
    var hashed = hash(uname+pword)

    // Check against credentials
    if (hashed != -159711510) {
        
        // Displays error message
        alertify.error('Incorrect Details Try again');
        return
    }

    // If the credentials are correct - displays a success message
    alertify.success('Logged In')

    // Getting the login page element
    login_page = document.querySelector('.login_page')

    // Animating the page out
    login_page.classList.add("animate__animated", "animate__bounceOutUp")

    // Getting list of available drones from server

    // Getting the home page element
    home = document.querySelector('.home')

    // Making the home page visible
    home.style.visibility = "visible"

    // Animating in the page
    home.classList.add("animate__animated", "animate__slideInLeft");

}

async function loaddrone() {
    // console.log('Taking a break...');
    // await new Promise(r => setTimeout(r, 2000));
    // console.log('Two seconds later, showing sleep in a loop...');

    // load animations
    content = document.querySelector('.contentbox')

    content.style.visibility = "visible"

    content.classList.add("animate__animated", "animate__slideInRight")

    content.addEventListener('animationend', () => {
        content.classList.remove("animate__animated", "animate__slideInRight")
    });


}


function camsize() {

    $(".cam").css("width", $(".cam").height());
}

window.addEventListener('resize', camsize);

$(document).ready(function () {
    $(".cam").css("width", $(".cam").height());
});

function hash(s) {
    return s.split("").reduce(function (a, b) {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a
    }, 0);
}