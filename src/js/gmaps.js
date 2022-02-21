MAP_ENABLED = true;

let map;

function initMap() {
    if (MAP_ENABLED) {
        map = new google.maps.Map(document.getElementById("map"), 
        {
            center: { lat: 52.770492, lng: -1.225819 },
            zoom: 15,
        });
    }
}