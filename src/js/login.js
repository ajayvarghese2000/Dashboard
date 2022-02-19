// This function checks the login credentials
// It takes  in no input
// Will display an error is the credentials are wrong
async function login() {

    // Get the username input
    var uname = $("#uname").val()

    // Get the password input
    var pword = $("#psw").val()

    // Hash both.
    var hashed = hash(uname + pword)

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

    // Getting list of available drones from server, set to repeat every 5 seconds
    await getDrones()
    await setInterval(getDrones, 5000);

    // Getting the home page element
    home = document.querySelector('.home')

    // Making the home page visible
    home.style.visibility = "visible"

    // Animating in the page
    home.classList.add("animate__animated", "animate__slideInLeft");

    // Getting the menu page element
    menu = document.querySelector('.menu')

    // Making the menu page visible
    menu.style.visibility = "visible"

    // Animating in the page
    menu.classList.add("animate__animated", "animate__fadeIn");

}