var map = L.map("map").setView([40.42052151221396, -3.7068076277600834], 3);
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

var popup = L.popup();
//Function onClick para ver las coordenadas donde haces Click
function onMapClick(e) {
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

// document.getElementById("show-markers").addEventListener("click", () => {
//   //Read Data from JSON
//   var xhr = new XMLHttpRequest();
//   xhr.open("GET", "markers.json", true);
//   xhr.onload = function () {
//     if (this.status == 200) {
//       var response = JSON.parse(xhr.responseText);
//       console.log(response.features[0]);
//       var marker = response.features;

//       var output = "";

//       for (var i = 0; i < marker.length; i++) {
//         //ADD POLYGONS
//         if (marker[i].geometry.type == "Polygon") {
//           var polygon = L.polygon([
//             [
//               marker[i].geometry.coordinates[0][0][1],
//               marker[i].geometry.coordinates[0][0][0],
//             ],
//             [
//               marker[i].geometry.coordinates[0][1][1],
//               marker[i].geometry.coordinates[0][1][0],
//             ],
//             [
//               marker[i].geometry.coordinates[0][2][1],
//               marker[i].geometry.coordinates[0][2][0],
//             ],
//           ]).addTo(map);
//         }
//         output += `<li> Coordenadas:   ${marker[i].geometry.coordinates[0]} and : ${marker[i].geometry.coordinates[1]} </li>`;
//         //ADD MARKERS
//         var markerCircuit = L.marker([
//           marker[i].geometry.coordinates[1],
//           marker[i].geometry.coordinates[0],
//         ]).addTo(map);

//         //ADD POPUP TO A MARKER
//         var popUp = markerCircuit.bindPopup("NEW city.");

//         //ADD TO A TABLE
//         document.getElementById("marker").innerHTML = output;
//         // console.log(`Output = ${output}`)
//       }
//     }
//   };
//   xhr.send();
// });

document.getElementById("show-circuits").addEventListener("click", () => {
  //Read Data from JSON
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "../JSON/f1Circuits.json", true);
  xhr.onload = function () {
    if (this.status == 200) {
      var response = JSON.parse(xhr.responseText);
      console.log(response.features[0]);
      var circuits = response.features;

      var cards = "";

      for (var i = 0; i < circuits.length; i++) {
        //ADD POLYGONS
        if (circuits[i].geometry.type == "Polygon") {
          var polygon = L.polygon([
            [
              circuits[i].geometry.coordinates[0][0][1],
              circuits[i].geometry.coordinates[0][0][0],
            ],
            [
              circuits[i].geometry.coordinates[0][1][1],
              circuits[i].geometry.coordinates[0][1][0],
            ],
            [
              circuits[i].geometry.coordinates[0][2][1],
              circuits[i].geometry.coordinates[0][2][0],
            ],
          ]).addTo(map);
        }

        cards += `
        <div class="card" style="width: 18rem;">
         <img src="${circuits[i].properties.img}" class="card-img-top" alt="...">
           <div class="card-body">
               <h5 class="card-title">${circuits[i].properties.name}</h5>
               <p class="card-text">${circuits[i].properties.city}</p>
               <a href="#" class="btn btn-primary">Add to map</a>
            </div>
        </div>`;

        //ADD MARKERS
        var markerCircuit = L.marker([
          circuits[i].geometry.coordinates[1],
          circuits[i].geometry.coordinates[0],
        ]).addTo(map);

        //ADD POPUP TO A MARKER
        var popUp = markerCircuit.bindPopup(
          `This circuits is: ${circuits[i].properties.name}`
        );

        //ADD TO A TABLE
        document.getElementById("circuits-cards").innerHTML = cards;
        // console.log(`Output = ${output}`)
      }
    }
  };
  xhr.send();
});

// //Custom marker
// const funny = L.icon({
//   iconUrl: "http://grzegorztomicki.pl/serwisy/pin.png",
//   iconSize: [50, 58], // size of the icon
//   iconAnchor: [20, 58], // changed marker icon position
//   popupAnchor: [0, -60], // changed popup position
// });

// // create popup contents
// const customPopup =
//   '<iframe width="360" height="310" src="https://www.youtube.com/embed/glKDhBuoRUs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';

// // specify popup options
// const customOptions = {
//   maxWidth: "auto", // set max-width
//   className: "customPopup", // name custom popup
// };

// // create marker object, pass custom icon as option, pass content and options to popup, add to map
// L.marker([lat, lng], {
//   icon: funny,
// })
//   .bindPopup(customPopup, customOptions)
//   .addTo(map);

// Drow polygon, circle, rectangle, polyline
// --------------------------------------------------

let drawnItems = L.featureGroup().addTo(map);

map.addControl(
  new L.Control.Draw({
    edit: {
      featureGroup: drawnItems,
      poly: {
        allowIntersection: false,
      },
    },
    draw: {
      polygon: {
        allowIntersection: false,
        showArea: true,
      },
    },
  })
);

map.on(L.Draw.Event.CREATED, function (event) {
  let layer = event.layer;
  let feature = (layer.feature = layer.feature || {});
  let type = event.layerType;

  feature.type = feature.type || "Feature";
  let props = (feature.properties = feature.properties || {});

  props.type = type;

  if (type === "circle") {
    props.radius = layer.getRadius();
  }

  drawnItems.addLayer(layer);
});



