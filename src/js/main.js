var TESTING = true;
var URI = window.location.protocol + "//" + window.location.host
var firstcheck = false
var servererror = false
var sock
var DRONES_AVAILABLE = false;
var CONNECTED = false;

// Variables for the update scheduler
var UPDATE_INTERVAL = 1;
var GRAPH_DIFFERENCE = 5;
var OLD_TIME = new Date();
var NEW_TIME = new Date(Date.parse(OLD_TIME) + 1000 * (UPDATE_INTERVAL))

// The Min and Max Value of geiger sensor
const GEIGER_MIN = 0;
const GEIGER_MAX = 2500;


if (TESTING) {
    URI = "https://ajayvarghese.me"
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
    try
    {

        // Connecting to the server endpoint
        r = await fetch(url)

        // Clearing the sidebar of old drones
        $(".sidebar").empty()
    } 
    catch (error) 
    {

        // if there is a connection problem alert the user
        alertify.error("Server seems to be down")

        // Clearing the sidebar of old drones
        $(".sidebar").empty()

        // Exit if the server is not connectable
        return

    }

    if (r.status != 200 && servererror == false) {
        // if there is a connection problem alert the user
        alertify.error("Server seems to be down")

        // Clearing the sidebar of old drones
        $(".sidebar").empty()

        // Stopping spam of error messages
        servererror = true

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

        // Setting the no drones available variable
        DRONES_AVAILABLE = false;
        
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

    // Setting the no drones available variable
    DRONES_AVAILABLE = true;

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
    hideall();
    $(".kc_fab_main_btn").css("visibility", "hidden");

    // Attempts to close any old connections
    try 
    {
        sock.disconnect()

        // Disconnection message
        $("#infomessage").html("Disconnected To Drone")

        // Sets the Connected status
        CONNECTED = false;
    }
    catch (error) 
    {
        console.log("not connected")
        
        // Sets the Connected status
        CONNECTED = false;
    }

    // Attempts to open a new websocket connection
    try 
    {

        // Creating the New SocketIO variable
        sock = new io(URI, {
            path: "/ws/socket.io/"
        });

        // Updating the Top message
        $("#infomessage").html("Connected To Drone");

        // debugging
        console.log("Connected");

        // Sets the Connected status
        CONNECTED = true;

        // Animate in the disconnect button
        $(".kc_fab_main_btn").css("visibility", "visible");
        content = document.querySelector(".kc_fab_main_btn");
        
        // Removes any existing animations
        content.classList.remove("animate__animated", "animate__backInRight");
        // Adds the animation classes
        content.classList.add("animate__animated", "animate__backInRight")

        content.addEventListener('animationend', () => {
            content.classList.remove("animate__animated", "animate__backInRight")
            return;
        });

    }
    catch (error) 
    {

        // if there is a connection problem alert the user
        alertify.error("Server seems to be down")

        // Sets the Connected status
        CONNECTED = false;

        return;
    }

    // The data listener, this function is always run with data from the
    // selected drone is received
    sock.on(String(drone.id), function (data) {

        // Variables to store data from the data packet
        var id, temp, pressure, humidity, lux, geiger, gas, air, gps, cam, person

        try
        {

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
            person = data["person"]

        } 
        catch (error) 
        {

            // If the data is missing or improper throw an error
            alertify.error("Data packet seems to be invalid")
            
            // Sets the Connected status
            CONNECTED = false;
            return
        }

        // Sets the Connected status
        CONNECTED = true;

        // Drawing the AI cam image to the AI Cam Box
        var aicamfeed = document.getElementById("aicamfeed");
        var bigaicamfeed = document.getElementById("bigaicamfeed");
        
        // Drawing the Thermal Cam Image to the Thermal Cam Box
        var tcamfeed = document.getElementById("tcamfeed");
        var bigtcamfeed = document.getElementById("bigtcamfeed");

        var time_now = new Date();
        var UPDATE = false;

        // Adding to the heatmap
        maps_rads_heatmap(gps, rads)
        sensor_thresholds(gps, air, gas, person)

        if (time_now > NEW_TIME) {
            UPDATE = true;
            OLD_TIME = time_now;
            NEW_TIME = new Date(Date.parse(OLD_TIME) + 1000 * (UPDATE_INTERVAL))
        } 
        else 
        {
            UPDATE = false;
        }

        switch (VIEW) {
            // If the main page is selected
            case 1:
                drawImageScaled(cam, aicamfeed)
                drawImageScaled(tcam, tcamfeed)

                if (UPDATE) {
                    // Set radiation level
                    setGaugeValue(geiger)

                    // Setting the info boxes
                    setInfobox(false, temp, humidity, pressure, lux)
                }

                break;
            // If the big AI page is selected
            case 2:
                drawImageScaled(cam, bigaicamfeed)
            // If the big Thermal page is selected
            case 3:
                drawImageScaled(tcam, bigtcamfeed)
            case 7:
                maps_updates_drone(gps)
            default:
                break;
        }

        if (UPDATE) {
            
            // Adding to the gas graph
            plotgas(gas)

            // Adding to the air poll graph
            plotair(air)
    
            // Adding to the Rad graph
            plotrad(geiger);
        }


    });


    // Gets the main contentbox DOM
    content = document.querySelector('#MAIN')

    // Sets it to be visible
    content.style.visibility = "visible"

    // Sets it to be on top
    content.style.zIndex  = "1"

    // Adds the animation classes
    content.classList.add("animate__animated", "animate__slideInRight")

    // Removes the classes aster the animation is finished
    content.addEventListener('animationend', () => {
        content.classList.remove("animate__animated", "animate__slideInRight")
    });

    $('#MAIN').css("content-visibility", "visible");

    VIEW = 1;


}

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

    // Deleting the old image off the ai cams
    aicamfeed = document.getElementById("aicamfeed");
    ctx = aicamfeed.getContext("2d")
    ctx.clearRect(0, 0, aicamfeed.width, aicamfeed.height);

    aicamfeed = document.getElementById("bigaicamfeed");
    ctx = aicamfeed.getContext("2d")
    ctx.clearRect(0, 0, aicamfeed.width, aicamfeed.height);

    // Deleting the old image off the thermal cams
    tcamfeed = document.getElementById("tcamfeed");
    tctx = tcamfeed.getContext("2d")
    tctx.clearRect(0, 0, tcamfeed.width, tcamfeed.height);

    tcamfeed = document.getElementById("bigtcamfeed");
    tctx = tcamfeed.getContext("2d")
    tctx.clearRect(0, 0, tcamfeed.width, tcamfeed.height);

    // Resetting gauge
    setGaugeValue(0)

    // resetting info box
    setInfobox(true, 0, 0, 0, 0)

    // Deleting old graphs
    Plotly.purge("gaschart")
    Plotly.purge("biggaschart")
    newplotgas()

    // Deleting old graphs
    Plotly.purge("airchart")
    Plotly.purge("bigairchart")
    newplotair()

    // Deleting old graphs
    Plotly.purge("radchart")
    newplotrad()

    // Clearing data off the map
    resetmap()
}

/**
 * @breif Allows updating the value of the geiger counter gauge
 * @param value - the CPM sent by the drone
 * @returns nothing
 */
function setGaugeValue(value) {

    // if the value is too big/too small it is rejected
    if (value > GEIGER_MAX || value < GEIGER_MIN) {
        return
    }

    // The % of the max value used to rotate the bar
    let rvalue = value / GEIGER_MAX;

    // Rotate the gauge bar by the % above
    document.querySelector(".gauge__fill").style.transform = 'rotate(' + rvalue / 2 + 'turn)';

    // Update the value of the CPM
    document.querySelector(".gauge__cover").textContent = value + " CPM";

}
/**
 * 
 * @brief Sets the values for the small info mox inside the main page
 * @param {*} reset - tells the program to reset the data or not
 * @param {*} temp  - the temperature value from the drone
 * @param {*} humid - the humidity level from the drone
 * @param {*} press - the pressure level from the drone
 * @param {*} lux  - the light detected by the drone
 * @returns 
 */
function setInfobox(reset, temp, humid, press, lux) {
    
    // if we're not resetting then update the values from the DOM
    if (reset != true)
    {
        $("#temp").html(String(temp) + " °C")
        $("#humidity").html(String(humid) + "%")
        $("#pressure").html(String(press) + " hPa")
        $("#lux").html(String(lux) + " Lux")
        return
    }
    
    // Otherwise reset the values
    $("#temp").html('Temp')
    $("#humidity").html('Humidity')
    $("#pressure").html('Pressure')
    $("#lux").html('Lux')
    return

}

/**
 * @brief Sets the date and time in the top bar
 */
function datetime() {
    var dt = new Date().toLocaleString();
    $("#dnt").html(String(dt))
}

/**
 * @brief plots the gas data
 * @param {*} gas - an array with all the gas data
 */
function plotgas(gas) {
    var time = new Date();

    var data = { 
        x : [[time],[time],[time]],
        y : [[gas["co"]], [gas["no2"]], [gas["nh3"]]]
    }
    var olderTime = new Date(Date.parse(time) - 1000 * (GRAPH_DIFFERENCE) )
    var futureTime = new Date(Date.parse(time) + 1000 * (GRAPH_DIFFERENCE) )

    var minuteView = {
        xaxis: {
          type: 'date',
          color : "#FFFFFF",
          gridcolor : "#FFFFFF",
          range: [olderTime,futureTime]
        }
    };

    Plotly.relayout('gaschart', minuteView);
    Plotly.relayout('biggaschart', minuteView);

    Plotly.extendTraces('gaschart', data,[0,1,2])
    Plotly.extendTraces('biggaschart', data,[0,1,2])
}

/**
 * @brief Creates the gas graphs
 */
function newplotgas() {
    var time = new Date();
    var olderTime = new Date(Date.parse(time) - 1000 * (GRAPH_DIFFERENCE) )
    var futureTime = new Date(Date.parse(time) + 1000 * (GRAPH_DIFFERENCE) )

    var layout = {
        title: {
            text : 'Detected Gas',
            font : {
                color : "#FFFFFF"
            }
        },
        xaxis: {
            title: 'Time',
            type: 'date',
            color : "#FFFFFF",
            gridcolor : "#FFFFFF",
            range: [olderTime,futureTime]
        },
        yaxis: {
            title: 'PPM',
            color : "#FFFFFF",
            gridcolor : "#FFFFFF"
        },
        plot_bgcolor: "#3F3F3F",
        paper_bgcolor: "#3F3F3F",
        legend : {
            bgcolor : "#3F3F3F",
            bordercolor : "#3F3F3F",
            font : {
                color : "#FFFFFF"
            }
        }
    };

    var co = {
        x: [time],
        y: [],
        name: 'Carbon Monoxide'
    }
    var no2 = {
        x: [time],
        y: [],
        name: 'Nitorgen Dioxide'
    }
    var nh3 = {
        x: [time],
        y: [],
        name: 'Ammonia'
    }
    var traces = [co,no2,nh3]

    var config = {responsive: true}

    Plotly.plot('gaschart', traces, layout, config)

    var bco = {
        x: [time],
        y: [],
        name: 'Carbon Monoxide'
    }
    var bno2 = {
        x: [time],
        y: [],
        name: 'Nitorgen Dioxide'
    }
    var bnh3 = {
        x: [time],
        y: [],
        name: 'Ammonia'
    }
    var traces = [bco,bno2,bnh3]

    Plotly.plot('biggaschart', traces, layout, config)
}

/**
 * @brief plots new air quality data
 * @param {*} air - array of particulate data
 */
function plotair(air) {
    var time = new Date();

    var data = { 
        x : [[time],[time],[time]],
        y : [[air["pm1"]],[air["pm2_5"]],[air["pm10"]]]
    }

    var olderTime = new Date(Date.parse(time) - 1000 * (GRAPH_DIFFERENCE) )
    var futureTime = new Date(Date.parse(time) + 1000 * (GRAPH_DIFFERENCE) )

    var minuteView = {
        xaxis: {
          type: 'date',
          color : "#FFFFFF",
          gridcolor : "#FFFFFF",
          range: [olderTime,futureTime]
        }
    };

    Plotly.relayout('airchart', minuteView);
    Plotly.relayout('bigairchart', minuteView);

    Plotly.extendTraces('bigairchart', data, [0,1,2]);
    Plotly.extendTraces('airchart', data, [0,1,2]);
}

/**
 * @brief Creates the air graphs
 */
function newplotair() {
    var time = new Date();
    var olderTime = new Date(Date.parse(time) - 1000 * (GRAPH_DIFFERENCE) )
    var futureTime = new Date(Date.parse(time) + 1000 * (GRAPH_DIFFERENCE) )

    var layout = {
        title: {
            text : 'Particulates',
            font : {
                color : "#FFFFFF"
            }
        },
        xaxis: {
            title: 'Time',
            color : "#FFFFFF",
            gridcolor : "#FFFFFF",
            range: [olderTime,futureTime]
        },
        yaxis: {
            title: 'ug/m3',
            color : "#FFFFFF",
            gridcolor : "#FFFFFF"
        },
        plot_bgcolor: "#3F3F3F",
        paper_bgcolor: "#3F3F3F",
        legend : {
            bgcolor : "#3F3F3F",
            bordercolor : "#3F3F3F",
            font : {
                color : "#FFFFFF"
            }
        }
    };

    var PM1 = {
        x: [time],
        y: [],
        name: 'PM1'
    }
    var PM25 = {
        x: [time],
        y: [],
        name: 'PM2.5'
    }
    var PM10 = {
        x: [time],
        y: [],
        name: 'PM10'
    }
    var traces = [PM1,PM25,PM10]

    var config = {responsive: true}

    Plotly.plot('airchart', traces, layout, config);

    var bPM1 = {
        x: [time],
        y: [],
        name: 'PM1'
    }
    var bPM25 = {
        x: [time],
        y: [],
        name: 'PM2.5'
    }
    var bPM10 = {
        x: [time],
        y: [],
        name: 'PM10'
    }

    var traces = [bPM1,bPM25,bPM10]

    Plotly.plot('bigairchart', traces, layout, config);
}

/**
 * @brief plots new radiation quality data
 * @param {*} rad - CMP
 */
 function plotrad(rad) {
    var time = new Date();

    var data = { 
        x : [[time]],
        y : [[rad]]
    }

    var olderTime = new Date(Date.parse(time) - 1000 * (GRAPH_DIFFERENCE) )
    var futureTime = new Date(Date.parse(time) + 1000 * (GRAPH_DIFFERENCE) )

    var minuteView = {
        xaxis: {
          type: 'date',
          color : "#FFFFFF",
          gridcolor : "#FFFFFF",
          range: [olderTime,futureTime]
        }
    };

    Plotly.relayout('radchart', minuteView);

    Plotly.extendTraces('radchart', data, [0]);
}

/**
 * @brief Creates the radiation graph
 */
function newplotrad() {
    var time = new Date();
    var olderTime = new Date(Date.parse(time) - 1000 * (GRAPH_DIFFERENCE) )
    var futureTime = new Date(Date.parse(time) + 1000 * (GRAPH_DIFFERENCE) )

    var layout = {
        title: {
            text : 'Counts Per Minute',
            font : {
                color : "#FFFFFF"
            }
        },
        xaxis: {
            title: 'Time',
            color : "#FFFFFF",
            gridcolor : "#FFFFFF",
            range: [olderTime,futureTime]
        },
        yaxis: {
            title: 'CPM',
            color : "#FFFFFF",
            gridcolor : "#FFFFFF"
        },
        plot_bgcolor: "#3F3F3F",
        paper_bgcolor: "#3F3F3F",
        legend : {
            bgcolor : "#3F3F3F",
            bordercolor : "#3F3F3F",
            font : {
                color : "#FFFFFF"
            }
        }
    };

    var RAD = {
        x: [time],
        y: [],
        name: 'CPM'
    }
    var traces = [RAD]

    var config = {responsive: true}

    Plotly.plot('radchart', traces, layout, config);
}


function sensor_thresholds(gps, air, gas, person){
    lat = gps["lat"]
    lng = gps["long"]

    air_thresholds = 2000;
    gas_thresholds = 2000;

    air = [air["pm1"], air["pm2_5"], air["pm10"]]
    gas = [gas["co"], gas["no2"], gas["nh3"]]

    var offset_lat = 0.0001933830801042884 * 0.479425538604203
    var offset_lng = 0.0003 * 0.8775825618903728


    for (let i = 0; i < air.length; i++) {
        const element = air[i];
        if (element > air_thresholds) {
            marker_serach(lat+offset_lat, lng+offset_lng, i+1)
        }
    }

    for (let i = 0; i < gas.length; i++) {
        const element = gas[i];
        if (element > gas_thresholds) {
            marker_serach(lat-offset_lng, lng-offset_lng, i+4)
        }
    }

    if (person == true) {
        marker_serach(lat, lng, 0)
    }

    return;
}

// Adds listeners to the login entry fields to run login with enter
function enter_listener() {
    var uname = document.getElementById("uname");
    var pass = document.getElementById("psw");

    uname.addEventListener("keyup", function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            login()
        }
    });

    pass.addEventListener("keyup", function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            login()
        }
    });
}

// Functions to run when the page finishes loading
$(document).ready(function () {
    // Adds the ability to login by pressing enter
    enter_listener()

    // Sets the date and time, and updates it periodically
    datetime()
    setInterval(datetime, 500);

    // Creates empty graphs to add data too
    newplotgas()
    newplotair()
    newplotrad()

});