function getGeo() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    });
  }
  return pos;
}

require(["esri/Map", "esri/views/MapView"], function(Map, MapView) {
  var map = new Map({
    basemap: "topo-vector"
  });

  var view = new MapView({
    container: "viewDiv",
    map: map,
    center: [pos.lat, pos.lng], // longitude, latitude
    zoom: 13
  });
});
