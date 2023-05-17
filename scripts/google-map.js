var GoogleMap = function() {
};

GoogleMap.prototype.map = null;
GoogleMap.prototype.zoomLevel = 2;
GoogleMap.prototype.center = new google.maps.LatLng(37.406945, -122.108284);
GoogleMap.prototype.bounds = null;

GoogleMap.prototype.mapOptions = {
    // zoom: 19,
    mapTypeId: 'hybrid'
};


// Initialize map
GoogleMap.prototype.init = function(){
    var so = this;
    so.map = new google.maps.Map(document.getElementById("map"),so.mapOptions);

    so.setCenterAndZoomOnMap(so.center);
    

    // so.map.addListener("click",function(event){
    //     console.log(`{lat: ${event.latLng.lat()}, lng: ${event.latLng.lng()}}`);
    // });

    so.map.addListener("zoom_changed",()=>{
        so.zoomLevel = so.map.getZoom();
    });
    so.map.addListener("bounds_changed",()=>{
        so.bounds = so.map.getBounds();
    });
    so.map.addListener("center_changed",(event)=>{
        so.center = so.map.getCenter();
    });
};

// Takes a GeoJson and plots the point(s)
GoogleMap.prototype.plotPoints = function(geojson){
    var so = this;
    if(geojson.type == "FeatureCollection"){
        for(let i=0;i<geojson.features.length;i++){
            if(geojson.features[i].geometry.type === 'Point'){
                const coords = geojson.features[i].geometry.coordinates;
                so.plotPoint(coords,geojson.features[i].properties);
            }
        }
    }
    else{
        if(geojson.geometry.type === 'Point'){
            const coords = geojson.geometry.coordinates;
            so.plotPoint(coords,geojson.properties);
            so.setCenterAndZoomOnMap({lat: coords[1], lng: coords[0]});
        }
    }
}

// Plots a single point with coordinates
GoogleMap.prototype.plotPoint = function(coords,properties = {place: ""}) {
    var so = this;
    const latLng = new google.maps.LatLng(coords[1], coords[0]);
    new google.maps.Marker({
        position: latLng,
        map: so.map,
        title: properties.place,
        icon: {
            url: './../assets/dot-red.svg',
            scaledSize: new google.maps.Size(6, 6),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(3.5,3.5)
        }
    });
}

// Sets the center and zoom on the map
GoogleMap.prototype.setCenterAndZoomOnMap = function(center){
    var so = this;
    so.setCenter({lat: so.center.lat(), lng: so.center.lng()});
    so.map.setCenter(center);
    so.map.setZoom(so.zoomLevel);
}

// gets the current zoom of the map
GoogleMap.prototype.getZoom = function(){
    return this.zoomLevel;
}

// Sets the zoom level of the map
GoogleMap.prototype.setZoom= function(zoom){
    this.zoomLevel = zoom;
}

// gets the current center of the map
GoogleMap.prototype.getCenter = function(){
    var so = this;
    return {lat: so.center.lat(), lng: so.center.lng()};
}

// Sets the center of the map
GoogleMap.prototype.setCenter = function(center){
    this.center = new google.maps.LatLng(center.lat, center.lng)
}