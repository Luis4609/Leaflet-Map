const infoDiv = document.getElementById("info");

let html = "";
// GeoJSON layer
let geoJson;

let id = 0;

// config map
let config = {
  minZoom: 2,
  maxZoom: 18,
  fullscreenControl: true,
};
// magnification with which the map will start
const zoom = 14;
// co-ordinates
const lat = 40.44760023396972;
const lng = -3.728957176208496;

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

function onEachFeature(feature, layer) {
  layer.bindPopup(
    `<img src="./images/${feature.properties.image}.jpg" alt="Imagen de la ${feature.properties.name}" class="imagen-facultad"> <p class="titulo-feature">${feature.properties.name}</p>`
  );

  id++;
  createFeature(feature, layer, id);
  layer.id = id;

  layer.on("mouseover", function (e) {
    // bindPopup
    this.openPopup();
    if (feature.geometry.type === "Polygon") {
      // style
      this.setStyle({
        fillColor: "#eb4034",
        weight: 2,
        color: "#eb4034",
        fillOpacity: 0.7,
      });
    }
  });
  layer.on("mouseout", function () {
    this.closePopup();
    if (feature.geometry.type === "Polygon") {
      // style
      this.setStyle({
        fillColor: "#3388ff",
        weight: 2,
        color: "#3388ff",
        fillOpacity: 0.2,
      });
    }
  });
}

function createFeature(feature, layer, id) {
  let featureDiv = document.createElement("div");
  featureDiv.classList.add("feature-element");

  featureDiv.id = id;

  featureDiv.onclick = () => {
    layer.fire("click");
  };

  let img;
  // Si hay imagen crear imagen
  if (feature.properties.image) {
    img = document.createElement("img");
    img.classList.add("imagen-facultad");
    img.src = `./images/${feature.properties.image}.jpg`;
    img.alt = "Imagen de: " + feature.properties.name;
    featureDiv.appendChild(img);
  }

  let title = document.createElement("span");
  title.classList.add("titulo");
  title.innerText = feature.properties.name;

  featureDiv.appendChild(title);

  infoDiv.appendChild(featureDiv);

  if (feature.geometry.type === "Polygon") {
    let descripcionPoligono = document.createElement("p");
    descripcionPoligono.innerText = `Puntos del polígono`;
    featureDiv.appendChild(descripcionPoligono);

    let cantidadPuntos = 0;

    feature.geometry.coordinates[0].forEach((coordinate) => {
      cantidadPuntos++;

      let detailTitle = document.createElement("span");
      detailTitle.classList.add("bold");
      detailTitle.innerText = `Punto ${cantidadPuntos}`;

      let detailDataX = document.createElement("span");
      detailDataX.innerHTML = `x: ${coordinate[0]}`;

      let detailDataY = document.createElement("span");
      detailDataY.innerHTML = `y: ${coordinate[1]}`;

      featureDiv.appendChild(detailTitle);
      featureDiv.appendChild(detailDataX);
      featureDiv.appendChild(detailDataY);
    });
  }
}

function createFeatureFromUserInput(feature, layer) {
  const name = window.prompt(
    "Introduce un nombre para el marcador",
    "SIN NOMBRE"
  );

  feature.properties.name = name;

  layer.bindPopup(`<p class="titulo-feature">${name}</p>`);

  id++;
  layer.id = id;

  layer.on("mouseover", function (e) {
    // bindPopup
    this.openPopup();

    if (feature.geometry.type === "Polygon") {
      // style
      this.setStyle({
        fillColor: "#eb4034",
        weight: 2,
        color: "#eb4034",
        fillOpacity: 0.7,
      });
    }
  });
  layer.on("mouseout", function () {
    this.closePopup();

    if (feature.geometry.type === "Polygon") {
      // style
      this.setStyle({
        fillColor: "#3388ff",
        weight: 2,
        color: "#3388ff",
        fillOpacity: 0.2,
      });
    }
  });

  createFeature(feature, layer, id);
}

/* ************************************* */
/*
	Drow polygon, circle, rectangle, polyline
*/
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

  if (type == "polygon" || type == "rectangle" || type == "polyline") {
    let points = [];
    feature.geometry = {
      type: "Polygon",
      coordinates: [],
    };

    if (type == "polyline") {
      let points = [];

      console.log(layer._latlngs);
      layer._latlngs.forEach((coordinate) => {
        let point = [];

        point.push(coordinate["lat"]);
        point.push(coordinate["lng"]);
        points.push(point);
      });
      feature.geometry.coordinates.push(points);
    } else {
      layer._latlngs.forEach((coordinate) => {
        coordinate.forEach((point) => {
          console.log(point["lat"]);
          console.log(point["lng"]);
          points.push([point["lat"], point["lng"]]);
        });
      });
    }
    feature.geometry.coordinates.push(points);
  } else if (type == "marker") {
    let points = [];

    points.push(layer._latlng["lat"]);
    points.push(layer._latlng["lng"]);

    feature.geometry = {
      type: "Point",
      coordinates: points,
    };
  }

  console.log(feature);
  createFeatureFromUserInput(feature, layer);
});

// Get each layer id and delete its feature info from the menu with the same id
map.on("draw:deleted", function (e) {
  e.layers.eachLayer((layer) => {
    infoDiv.removeChild(document.getElementById(layer.id));
  });
});
/* ************************************* */

/* ************************************* */
/*
	Show coordinates of the mouse
*/
const markerPlace = document.querySelector(".marker-position");

// obtaining coordinates after clicking on the map
map.on("click", function (e) {
  markerPlace.textContent = e.latlng;
});
/* ************************************* */

/* ************************************* */
/*
	MODAL
*/
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};
modal.style.display = "block";

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
/* ************************************* */

// Render the map
geoJson = L.geoJSON(jsonData, { onEachFeature }).addTo(map);
