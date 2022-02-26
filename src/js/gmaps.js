MAP_ENABLED = true;

let map;

// Global locations of the relevant markers
let DRONE_MARKER = false;

let PEOPLE_MARKER = [];

let GAS_MARKER_CO = [];
let GAS_MARKER_NO2 = [];
let GAS_MARKER_NH3 = [];

let AIR_MARKER_PM1 = [];
let AIR_MARKER_PM2_5 = [];
let AIR_MARKER_PM10 = [];

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

    if (GAS_MARKER_CO.length>0) {

        for (let i = 0; i < GAS_MARKER_CO.length; i++) {
            GAS_MARKER_CO[i].setMap(null)
        }

        GAS_MARKER_CO = []
    }

    if (GAS_MARKER_NO2.length>0) {

        for (let i = 0; i < GAS_MARKER_NO2.length; i++) {
            GAS_MARKER_NO2[i].setMap(null)
        }

        GAS_MARKER_NO2 = []
    }

    if (GAS_MARKER_NH3.length>0) {

        for (let i = 0; i < GAS_MARKER_NH3.length; i++) {
            GAS_MARKER_NH3[i].setMap(null)
        }

        GAS_MARKER_NH3 = []
    }

    if (AIR_MARKER_PM1.length>0) {

        for (let i = 0; i < AIR_MARKER_PM1.length; i++) {
            AIR_MARKER_PM1[i].setMap(null)
        }

        AIR_MARKER_PM1 = []
    }

    if (AIR_MARKER_PM2_5.length>0) {

        for (let i = 0; i < AIR_MARKER_PM2_5.length; i++) {
            AIR_MARKER_PM2_5[i].setMap(null)
        }

        AIR_MARKER_PM2_5 = []
    }

    if (AIR_MARKER_PM10.length>0) {

        for (let i = 0; i < AIR_MARKER_PM10.length; i++) {
            AIR_MARKER_PM10[i].setMap(null)
        }

        AIR_MARKER_PM10 = []
    }

    if (PEOPLE_MARKER.length>0) {

        for (let i = 0; i < PEOPLE_MARKER.length; i++) {
            PEOPLE_MARKER[i].setMap(null)
        }

        PEOPLE_MARKER = []
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

// Function for adding new Gas markers
// type: 0 - CO, 1 - NO2, 2 - NH3
function updateGas(lat,log,type){

    switch (type) {
        case 0:
            var image = {
                url: 'assets/co.png',
                scaledSize: new google.maps.Size(30, 30)
            };
            break;
        case 1:
            var image = {
                url: 'assets/no2.png',
                scaledSize: new google.maps.Size(30, 30)
            };
            break;
        case 2:
            var image = {
                url: 'assets/nh3.png',
                scaledSize: new google.maps.Size(30, 30)
            };
            break;
        default:
            break;
    }

    var marker = new google.maps.Marker({
        position:{ lat: lat, lng: log },
        icon: image,
    });

    switch (type) {
        case 0:
            GAS_MARKER_CO.push(marker)
            GAS_MARKER_CO[GAS_MARKER_CO.length - 1].setMap(map);
            break;
        case 1:
            GAS_MARKER_NO2.push(marker)
            GAS_MARKER_NO2[GAS_MARKER_NO2.length - 1].setMap(map);
            break;
        case 2:
            GAS_MARKER_NH3.push(marker)
            GAS_MARKER_NH3[GAS_MARKER_NH3.length - 1].setMap(map);
            break;
        default:
            break;
    }

    return;
}

// Function for adding new Air Markers
// type: 0 - PM1, 1 - PM2.5, 2 - PM10
function updateAir(lat,log,type){

    switch (type) {
        case 0:
            var image = {
                url: 'assets/pm1.png',
                scaledSize: new google.maps.Size(30, 30)
            };
            break;
        case 1:
            var image = {
                url: 'assets/pm25.png',
                scaledSize: new google.maps.Size(30, 30)
            };
            break;
        case 2:
            var image = {
                url: 'assets/pm10.png',
                scaledSize: new google.maps.Size(30, 30)
            };
            break;
        default:
            break;
    }

    var marker = new google.maps.Marker({
        position:{ lat: lat, lng: log },
        icon: image,
    });

    switch (type) {
        case 0:
            AIR_MARKER_PM1.push(marker)
            AIR_MARKER_PM1[AIR_MARKER_PM1.length - 1].setMap(map);
            break;
        case 1:
            AIR_MARKER_PM2_5.push(marker)
            AIR_MARKER_PM2_5[AIR_MARKER_PM2_5.length - 1].setMap(map);
            break;
        case 2:
            AIR_MARKER_PM10.push(marker)
            AIR_MARKER_PM10[AIR_MARKER_PM10.length - 1].setMap(map);
            break;
        default:
            break;
    }

    return;
}

function updatePeople(lat, log) {
    var image = {
        url: 'assets/person.png',
        scaledSize: new google.maps.Size(30, 30)
    };

    var marker = new google.maps.Marker({
        position:{ lat: lat, lng: log },
        icon: image,
    });

    PEOPLE_MARKER.push(marker);
    PEOPLE_MARKER[PEOPLE_MARKER.length - 1].setMap(map);

    return;
}

function marker_serach(i_lat,i_lng, type) {
    if (maps_update_scheduler() == false) {
        return;
    }

    var searcharr;
    const lat_offset = 0.00055
    const lng_offset = 0.001

    switch (type) {
        case 0:
            searcharr = PEOPLE_MARKER;
            break;
        case 1:
            searcharr = AIR_MARKER_PM1;
            break;
        case 2:
            searcharr = AIR_MARKER_PM2_5;
            break;
        case 3:
            searcharr = AIR_MARKER_PM10;
            break;
        case 4:
            searcharr = GAS_MARKER_CO;
            break;
        case 5:
            searcharr = GAS_MARKER_NO2;
            break;
        case 6:
            searcharr = GAS_MARKER_NH3;
            break;
        default:
            return;
    }

    if (searcharr.length > 0) {
        for (let i = 0; i < searcharr.length; i++) {
            const marker = searcharr[i];
            const lat = marker.getPosition().lat();
            const lng = marker.getPosition().lng();
            const max_lat = lat + lat_offset;
            const min_lat = lat - lat_offset;
            const max_lng = lng + lng_offset;
            const min_lng = lng - lng_offset;
            if ((i_lat >= min_lat && i_lat <= max_lat) && (i_lng >= min_lng && i_lng <= max_lng)) {
                console.log("too close")
                return;
            }
        }
    }

    switch (type) {
        case 0:
            updatePeople(i_lat,i_lng)
            break;
        case 1:
            updateAir(i_lat,i_lng,0)
            break;
        case 2:
            updateAir(i_lat,i_lng,1)
            break;
        case 3:
            updateAir(i_lat,i_lng,2)
            break;
        case 4:
            updateGas(i_lat,i_lng,0)
            break;
        case 5:
            updateGas(i_lat,i_lng,1)
            break;
        case 6:
            updateGas(i_lat,i_lng,2)
            break;
        default:
            return;
    }

    return;

    


}