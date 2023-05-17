var AppleMap = function(){
};

AppleMap.prototype.map = null;
AppleMap.prototype.tokenId = "";
AppleMap.prototype.zoomLevel = 2;
AppleMap.prototype.center = null;
AppleMap.prototype.bounds = null;


AppleMap.prototype.init = function(){
    var so = this;

    mapkit.init({
        authorizationCallback: function(done) {
            done(so.tokenId);
        },
    });
    so.map = new mapkit.Map("map");
    
    // External settings
    so.map._allowWheelToZoom = true;
    so.setCenterAndZoomOnMap(so.center);

    // Events
    so.map.addEventListener("zoom-end", function(event){
        so.setZoom(event.target._impl.zoomLevel);
    });
    so.map.addEventListener("region-change-end", function(event){
        so.setCenter({lat: event.target.center.latitude, lng: event.target.center.longitude});
    });
};

// Takes a GeoJson and plots the point(s)
AppleMap.prototype.plotPoints = function(geojson){
    var so = this;
    if(geojson.type == "FeatureCollection"){
        var markers = [];
        for(let i=0;i<geojson.features.length;i++){
            if(geojson.features[i].geometry.type === 'Point'){
                const coords = geojson.features[i].geometry.coordinates;
                markers.push(so.plotPoint(coords));
            }
        }
        so.map.showItems(markers);
    }
    else{
        if(geojson.geometry.type === 'Point'){
            const coords = geojson.geometry.coordinates;
            so.map.showItems(so.plotPoint(coords));
            so.setCenterAndZoomOnMap({lat: coords[1], lng: coords[0]});
        }
    }
}

// Plots a single point with coordinates
AppleMap.prototype.plotPoint = function (coords,properties = {place: ""}) {
    const pointCoordinates = new mapkit.Coordinate(coords[1],coords[0]);
    const marker = new mapkit.MarkerAnnotation(pointCoordinates,{color: '#EE4266'});
    return marker;
}

// Sets the center and zoom on the map
AppleMap.prototype.setCenterAndZoomOnMap = function(center){
    var so = this;
    so.setCenter(center);
    so.map.setCenterAnimated(new mapkit.Coordinate(center.lat,center.lng),true);
    so.map._impl.zoomLevel = so.zoomLevel;
}

// gets the current zoom of the map
AppleMap.prototype.getZoom = function(){
    return this.zoomLevel;
}

// Sets the zoom level of the map
AppleMap.prototype.setZoom= function(zoom){
    this.zoomLevel = zoom;
}

// gets the current center of the map
AppleMap.prototype.getCenter = function(){
    var so = this;
    return so.center;
}

// Sets the center of the map
AppleMap.prototype.setCenter = function(center){
    this.center = center;
}