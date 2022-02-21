var map = L.map("map", {
  center: [39.73, -104.99],
  zoom: 10,
  layers: [grayscale, cities],
});

var baseMaps = {
  Grayscale: grayscale,
  Streets: streets,
};

var overlayMaps = {
  Cities: cities,
};

L.control.layers(baseMaps, overlayMaps).addTo(map);

var baseMaps = {
  "<span style='color: gray'>Grayscale</span>": grayscale,
  Streets: streets,
};

var littleton = L.marker([39.61, -105.02]).bindPopup("This is Littleton, CO."),
  denver = L.marker([39.74, -104.99]).bindPopup("This is Denver, CO."),
  aurora = L.marker([39.73, -104.8]).bindPopup("This is Aurora, CO."),
  golden = L.marker([39.77, -105.23]).bindPopup("This is Golden, CO.");

//add layer
var cities = L.layerGroup([littleton, denver, aurora, golden]);

var grayscale = L.tileLayer(mapboxUrl, {
    id: "MapID",
    tileSize: 512,
    zoomOffset: -1,
    attribution: mapboxAttribution,
  }),
  streets = L.tileLayer(mapboxUrl, {
    id: "MapID",
    tileSize: 512,
    zoomOffset: -1,
    attribution: mapboxAttribution,
  });
