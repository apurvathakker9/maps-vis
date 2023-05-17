var Mapbox = function(){
}

Mapbox.prototype.map = null;
Mapbox.prototype.accessToken = 'pk.eyJ1IjoiYXRhcHVydmF0aGFra2VyOTA2IiwiYSI6ImNsaHMzMm0xcDB4M2QzcW52MDl5djJ0MzcifQ.sUK2xX4FPARjr7JIyfxjwQ';

Mapbox.prototype.zoomLevel = 2;
Mapbox.prototype.center = null;
Mapbox.prototype.bounds = null;

Mapbox.prototype.init = function(){
    var so = this;
    const centerLatLng = new mapboxgl.LngLat(so.center.lng, so.center.lat);

    mapboxgl.accessToken = so.accessToken;
    so.map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/satellite-v9', // style URL
        center: centerLatLng, // starting position [lng, lat]
        zoom: so.zoomLevel // starting zoom
    });

    so.map.addControl(new mapboxgl.NavigationControl());

    // Events
    so.map.on('zoomend',()=>{
        so.setZoom(so.map.getZoom());
    });
    so.map.on('dragend',()=>{
        so.setCenter(so.map.getCenter());
    })
};

// Takes a GeoJson and plots the point(s)
Mapbox.prototype.plotPoints = function(geojson){
    var so = this;

    if(geojson.type == "FeatureCollection"){
        for(let i =0;i<geojson.features.length;i++){
            const coords = geojson.features[i].geometry.coordinates;
            so.plotPoint(coords);
        }
    }
    else{
        if(geojson.geometry.type === 'Point'){
            const coords = geojson.geometry.coordinates;
            so.plotPoint(coords);
            so.setCenterAndZoomOnMap({lat: coords[1], lng: coords[0]});
        }
    }
}

// Plots a single point with coordinates
Mapbox.prototype.plotPoint = function(coords,properties = {place: ""}){
    var so = this;
    var el = document.createElement('div');
    el.className = 'marker';
    new mapboxgl.Marker(el)
    .setLngLat([coords[0],coords[1]])
    .addTo(so.map);
}


// Sets the center and zoom on the map
Mapbox.prototype.setCenterAndZoomOnMap = function(center){
    var so = this;
    so.setCenter(center);
    so.map.setCenter([center.lng,center.lat]);
    so.map.setZoom(so.zoomLevel);
}

// gets the current zoom of the map
Mapbox.prototype.getZoom = function(){
    return this.zoomLevel + 1.3;
}

// Sets the zoom level of the map
Mapbox.prototype.setZoom= function(zoom){
    this.zoomLevel = zoom - 1.3;
}

// gets the current center of the map
Mapbox.prototype.getCenter = function(){
    var so = this;
    return {lat: so.center.lat, lng: so.center.lng};
}

// Sets the center of the map
Mapbox.prototype.setCenter = function(center){
    this.center = center;
}