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

// This function is run when a drone from the side bar is clicked
// It sets-up the websocket and the websocket listeners for the drone
// in question. Once connected the data will be streamed to the user
// Takes in a drone DOM element
async function loaddrone(drone) {

    // Clean Up main
    clean()

    // Attempts to close any old connections
    try {
        sock.disconnect()
    } catch (error) {
        console.log("not connected")
    }

    // Attempts to open a new websocket connection
    try {

        // Creating the New SocketIO variable
        sock = new io(URI, {
            path: "/ws/socket.io/"
        });
    } catch (error) {

        // if there is a connection problem alert the user
        alertify.error("Server seems to be down")
    }

    // The data listener, this function is always run with data from the
    // selected drone is received
    sock.on(String(drone.id), function (data) {

        // Variables to store data from the data packet
        var id, temp, pressure, humidity, lux, geiger, gas, air, gps, cam

        try {

            // Attempts to get the data from the data packet
            id = data["dname"]
            temp = data["temp"]
            pressure = data["pressure"]
            humidity = data["humidity"]
            lux = data["lux"]
            geiger = data["geiger"]
            gas = data["gas"]
            air = data["air"]
            gps = data["gps"]
            cam = data["cam"]
            tcam = data["tcam"]

        } catch (error) {

            // If the data is missing or improper throw an error
            alertify.error("Data packet seems to be invalid")
            return
        }

        // Drawing the AI cam image to the AI Cam Box
        var aicamfeed = document.getElementById("aicamfeed");
        drawImageScaled(cam, aicamfeed)

        // Drawing the Thermal Cam Image to the Thermal Cam Box
        var tcamfeed = document.getElementById("tcamfeed");
        drawImageScaled(tcam, tcamfeed)

        // Set radiation level
        setGaugeValue(geiger)

        // setting the info boxes
        setInfobox(false, temp, humidity, pressure,lux)


    });


    // Gets the main contentbox DOM
    content = document.querySelector('.contentbox')

    // Sets it to be visible
    content.style.visibility = "visible"

    // Adds the animation classes
    content.classList.add("animate__animated", "animate__slideInRight")

    // Removes the classes aster the animation is finished
    content.addEventListener('animationend', () => {
        content.classList.remove("animate__animated", "animate__slideInRight")
    });


}

// Functions to automatically resize elements
function camsize() {

    $("#tcamdiv").css("width", $(".cam").width());
    $(".poulltion").css("width", $(".contentbottem").width() - $(".cam").width() - 10)
}

window.addEventListener('resize', camsize);

$(document).ready(function () {
    $("#tcamdiv").css("width", $(".cam").width());
    $(".poulltion").css("width", $(".contentbottem").width() - $(".cam").width() - 10)
});


// Hashing function to take the login details
function hash(s) {
    return s.split("").reduce(function (a, b) {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a
    }, 0);
}

// Function to draw Base64 PNG's to canvases
// Takes in a base64 image and a canvas DOM element
function drawImageScaled(base64, canvas) {
    var image = new Image()
    image.src = 'data:image/png;base64,' + base64
    var ctx = canvas.getContext("2d")
    image.onload = function () {
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
    };
    return
}

// This function deletes old data from the main page
function clean() {

    // Deleting the old image off the ai cam
    aicamfeed = document.getElementById("aicamfeed");
    ctx = aicamfeed.getContext("2d")
    ctx.clearRect(0, 0, aicamfeed.width, aicamfeed.height);

    // Deleting the old image off the thermal cam
    tcamfeed = document.getElementById("tcamfeed");
    tctx = tcamfeed.getContext("2d")
    tctx.clearRect(0, 0, tcamfeed.width, tcamfeed.height);

    // Resetting gauge
    setGaugeValue(0)

    // resetting info box
    setInfobox(true, 0, 0, 0,0)
}

function setGaugeValue(value) {

    const min = 0;
    const max = 2500;
    let rvalue = value/max;

    document.querySelector(".gauge__fill").style.transform = 'rotate(' + rvalue / 2 + 'turn)';
    document.querySelector(".gauge__cover").textContent = value + " CPM";

}

function setInfobox(reset, temp, humid, press,lux) {
    if (reset ==true)
    {
        $("#temp").html('Temp')
        $("#humidity").html('Humidity')
        $("#pressure").html('Pressure')
        $("#lux").html('Lux')
        return
    }
    else
    {
        $("#temp").html(String(temp) + " °C")
        $("#humidity").html(String(humid) + "%")
        $("#pressure").html(String(press) + " hPa")
        $("#lux").html(String(lux) + " Lux")
        return
    }
}