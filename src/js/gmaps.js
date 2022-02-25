MAP_ENABLED = true;

let map;

// Global locations of the relevant markers
let DRONE_MARKER = false;
let PEOPLE_MARKER = false;
let GAS_MARKER = false;
let RAD_MARKER = false;
let AIR_MARKER = false;

let HEATMAP_DATA = [];
let HEATMAP = false;

var MAPS_UPDATE_INTERVAL = 1;
var MAPS_OLD_TIME = new Date();
var MAPS_NEW_TIME = new Date(Date.parse(MAPS_OLD_TIME) + 1000 * (MAPS_UPDATE_INTERVAL))

function initMap() {

    if (MAP_ENABLED) {
        map = new google.maps.Map(document.getElementById("map"), 
        {
            center: { lat: 52.770492, lng: -1.225819 },
            zoom: 15,
            mapId: 'c972154f0f975535',
            mapTypeControl: false,
            streetViewControl: false,
        });
    }

}

// Adds the drone marker onto the map using Google API
function updateDrone(lat,log){

    const image = {
        url: 'assets/drone.png',
        scaledSize: new google.maps.Size(50, 50)
    };

    // Checking if a drone currently exists
    if (DRONE_MARKER == false) {
        var marker = new google.maps.Marker({
            position:{ lat: lat, lng: log },
            icon: image,
        });

        // Adding the local marker to the global scope
        DRONE_MARKER = marker;
        
        // Showing the drone marker on the map
        DRONE_MARKER.setMap(map);
        return;
    }

    // updating the position of the drone.
    var latlog = new google.maps.LatLng(lat, log);
    DRONE_MARKER.setPosition(latlog);
    return;
}

// Clears all data off graph
function resetmap(){
    
    if (DRONE_MARKER != false) {
        
        // deleting the marker
        DRONE_MARKER.setMap(null);

        // setting to default state
        DRONE_MARKER = false;
    }

    if (HEATMAP != false) {

        // removing data
        HEATMAP_DATA = [];

        // removing from current map
        HEATMAP.setMap(null);

        // resetting value
        HEATMAP = false;
    }

    return;
}

// Takes the GPS pos of the drone and updates the graph with it.
function maps_updates_drone(gps){
    if (maps_update_scheduler() == false) {
        return;
    }
    updateDrone(gps["lat"], gps["long"])
    return;
}

// Function to only update the map when the MAPS_UPDATE_INTERVAL time has passed
function maps_update_scheduler() {
    var time_now = new Date();
    var UPDATE = false;

    if (time_now > MAPS_NEW_TIME) {
        UPDATE = true;
        MAPS_OLD_TIME = time_now;
        MAPS_NEW_TIME = new Date(Date.parse(OLD_TIME) + 1000 * (MAPS_UPDATE_INTERVAL))
    } 
    return UPDATE;
}

function maps_rads_heatmap(gps,rads) {

    if (maps_update_scheduler() == false) {
        return;
    }

    var weight = (rads / GEIGER_MAX) * 2;
    var latlog = new google.maps.LatLng(gps["lat"], gps["long"]);
    var payload = {location: latlog, weight: weight}
    
    HEATMAP_DATA.push(payload)

    if (HEATMAP == false) {
        HEATMAP = new google.maps.visualization.HeatmapLayer({
            data: HEATMAP_DATA,
            radius: 15,
            maxIntensity: 1
        });

        HEATMAP.setMap(map);
    }

    HEATMAP.setData(HEATMAP_DATA);

    

    return;
}