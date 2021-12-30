var URI = "http://ajayvarghese.me"
var firstcheck = false
var sock

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

}

// This function will check with the server what drones are connected
// It will also update the side bar with the number of drones connected
// If there are no drones or the server is unreachable it will display
// error messages.
async function getDrones() {

    // setting the API endpoint
    var url = URI + "/drones"

    // Variable to store the result from the server
    let r

    // Attempting to connect to the server
    try {

        // Connecting to the server endpoint
        r = await fetch(url)

        // Clearing the sidebar of old drones
        $(".sidebar").empty()
    } catch (error) {

        // if there is a connection problem alert the user
        alertify.error("Server seems to be down")

        // Clearing the sidebar of old drones
        $(".sidebar").empty()

        // Exit if the server is not connectable
        return

    }

    // Pull the JSON data from the request
    data = await r.json()

    // Check if there are any drones connected
    if (data["drones"].length == 0) {

        // Checks if the user has been alerted about the number of drones
        if (firstcheck == false) {

            // Alert the user there are no drones
            alertify.alert("Server", "There are no drones connected right now.")

            // Only alert the user once if there are no drones connected
            firstcheck = true
        }

        // Returning if there are no drones
        return
    }

    // If there are drones add a new drone element to the side bar and set its ID
    for (let i = 0; i < data["drones"].length; i++) {
        let id = data["drones"][i]["id"]
        let div = '<div class="tooltip" onclick=loaddrone(this) id = "' + id + '">'
        $(".sidebar").append(div)
        $("#" + id).append('<img src="assets/drone.png">')
        let tooltip = '<span class="tooltiptext">Drone ' + id + '</span>'
        $("#" + id).append(tooltip)
    }

    // Once all drones have been added return back
    return
}

async function loaddrone(drone) {

    try {
        sock.disconnect()
        console.log("old disconnected")
    } catch (error) {
        console.log("not connected")
    }

    sock = new io(URI, {
        path: "/ws/socket.io/"
    });

    sock.on('connect',function() {
        console.log('Client has connected to the server!');
    });

    sock.on(String(drone.id),function(data) {
        
        var id = data["dname"]
        var temp = data["temp"]
        var pressure = data["pressure"]
        var humidity= data["humidity"]
        var lux= data["lux"]
        var geiger= data["geiger"]
        var gas= data["gas"]
        var air= data["air"]
        var gps= data["gps"]
        var cam= data["cam"]
        var tcam= data["tcam"]
        
        // var c = document.getElementById("myCanvas");
        // var ctx = c.getContext("2d");
        // var img = new Image()
        
        // img.onload = function() {
        //   ctx.drawImage(img, 0, 0);
        // };
        
      
        // img.src = 'data:image/png;base64,' + data["cam"]
      
      
        console.log(gps);
    });
      

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