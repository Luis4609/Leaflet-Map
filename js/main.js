var map = L.map("map").setView([40.42052151221396, -3.7068076277600834], 11);
var markers = [];

var tiles = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
  {
    maxZoom: 18,
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
  }
).addTo(map);

//ADD INITIALS MARKERS
// var marker = L.marker([40.44751150330078, -3.9966411793250676]).addTo(map);
// marker.bindPopup("Villanueva de la Cañada.");
// var markerIES = L.marker([40.446518734158786, -3.6643743227422885]).addTo(map);
// markerIES.bindPopup("IES Clara del Rey.");

//Function onClick para ver las coordenadas donde haces Click
function onMapClick(e) {
  console.log("Pepe");
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
}

function onMapDoubleClick(e) {
  markers.setLatLng(e.latlng).openPopup().openOn(map);
}

map.on("click", onMapClick);

map.on("dblclick", onMapDoubleClick);

document.getElementById("show-markers").addEventListener("click", () => {
  //Read Data from JSON
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "markers.json", true);
  xhr.onload = function () {
    if (this.status == 200) {
      var response = JSON.parse(xhr.responseText);
      console.log(response.features[0]);
      var marker = response.features;

      var output = "";

      for (var i = 0; i < marker.length; i++) {
        //ADD POLYGONS
        if (marker[i].geometry.type == "Polygon") {
          var polygon = L.polygon([
            [
              marker[i].geometry.coordinates[0][0][1],
              marker[i].geometry.coordinates[0][0][0],
            ],
            [
              marker[i].geometry.coordinates[0][1][1],
              marker[i].geometry.coordinates[0][1][0],
            ],
            [
              marker[i].geometry.coordinates[0][2][1],
              marker[i].geometry.coordinates[0][2][0],
            ],
          ]).addTo(map);
        }
        output += `<li> Coordenadas:   ${marker[i].geometry.coordinates[0]} and : ${marker[i].geometry.coordinates[1]} </li>`;
        //ADD MARKERS
        var markerJson = L.marker([
          marker[i].geometry.coordinates[1],
          marker[i].geometry.coordinates[0],
        ]).addTo(map);

        //ADD POPUP TO A MARKER
        var popUp = markerJson.bindPopup("NEW city.");

        //ADD TO A TABLE
        document.getElementById("marker").innerHTML = output;
        // console.log(`Output = ${output}`)
      }
    }
  };
  xhr.send();
});
