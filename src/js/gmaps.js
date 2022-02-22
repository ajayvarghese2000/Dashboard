MAP_ENABLED = true;

let map;

// Global locations of the relevant markers
let DRONE_MARKER = false;
let PEOPLE_MARKER = false;
let GAS_MARKER = false;
let RAD_MARKER = false;
let AIR_MARKER = false;

function initMap() {
    if (MAP_ENABLED) {
        map = new google.maps.Map(document.getElementById("map"), 
        {
            center: { lat: 52.770492, lng: -1.225819 },
            zoom: 15,
        });
    }
}

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

function resetmap(){
    
    if (DRONE_MARKER != false) {
        // deleting the marker
        DRONE_MARKER.setMap(null);

        // setting to default state
        DRONE_MARKER = false;
    }

    return;
}