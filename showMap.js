

function getLat() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          resolve(position.coords.latitude);
        });
      } else {
        reject("No Navigator");
      }
    });
  }

  function getLong() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          resolve(position.coords.longitude);
        });
      } else {
        reject("No Navigator");
      }
    });
  }

function geocode(addr){

  return new Promise((resolve, reject) => {
  GMaps.geocode({

    address: addr,
    callback: function(results, status) {
      if (status == 'OK') {
        latlng = results[0].geometry.location;
        resolve(latlng);
      } else if (status == 'ZERO_RESULTS') {
        reject('Sorry, no results found');
        return -1;
       }
      }
    });
  });
}

function addToMap(addme){
   return new Promise((resolve, reject) => {
   geocode(addme).then(coords =>{
     var lat = coords.lat();
     var long = coords.lng()

     var point = {
         type: "point",
         longitude: long,
         latitude: lat

       };


      var simpleMarkerSymbol = {
         type: "simple-marker",
        color: [226, 119, 40],  // orange
         outline: {
           color: [255, 255, 255], // white
           width: 1,
           size:"10000px"
         }
       };



       var attrib = {
         geometry: point,
         symbol: simpleMarkerSymbol
       };

       resolve(attrib);
      });
   });
}

  require(["esri/Map",
      "esri/views/MapView",
      "esri/Graphic",
      "esri/layers/GraphicsLayer"], function(Map, MapView,Graphic,GraphicsLayer) {
    var map = new Map({
      basemap: "topo-vector"
    });

    addToMap('Santa Cruz, California').then(point => {
           var graphicsLayer = new GraphicsLayer();
            map.add(graphicsLayer);
            var grap = new Graphic({
             geometry:point.geometry,
             symbol:point.symbol

            });
            console.log(point.geometry);
            console.log(point.symbol);
            graphicsLayer.add(grap);


    getLat().then(latitude => {
      getLong().then(longitude => {
        console.log(Math.round(latitude))
        console.log(Math.round(longitude))





          var view = new MapView({
            container: "viewDiv",
            map: map,
            center: [Math.round(longitude),Math.round(latitude)], // longitude, latitude
            //center: [0,0],
            zoom: 13
          });

        });
      });
    });
  });


  
