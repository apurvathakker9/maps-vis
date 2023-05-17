var HereMap = function(){
};

HereMap.prototype.map = null;
HereMap.prototype.zoomLevel = 2;
HereMap.prototype.center = null;
HereMap.prototype.bounds = null;

HereMap.prototype.icon = `<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" width="8" height="8" version="1.1"><circle cx="4" cy="4" r="4" fill="#EE4266"/></svg>`;

HereMap.prototype.init = function(){
    var so = this;

    var platform = new H.service.Platform({
        apikey: 'Z79qsFrPQGcib342QxzJ9DiZawusXkWGyx0Q0R-wNuc'
    });
    var defaultLayers = platform.createDefaultLayers();
    so.map = new H.Map(document.getElementById('map'),
        defaultLayers.raster.satellite.map,{
        center: this.center,
        zoom: so.zoomLevel,
    });

    var ui = H.ui.UI.createDefault(so.map, defaultLayers);

    var mapEvents = new H.mapevents.MapEvents(so.map);
    var behavior = new H.mapevents.Behavior(mapEvents);

    so.map.addEventListener('mapviewchangeend',(event)=>{
        so.setZoom(so.map.getZoom());
    });
    
    so.map.addEventListener('dragend',(event)=>{
        so.setCenter(so.map.getCenter())
    });
};

// Takes a GeoJson and plots the point(s)
HereMap.prototype.plotPoints = function(geojson){
    var so = this;
    if(geojson.type == "FeatureCollection"){
        for(let i=0;i<geojson.features.length;i++){
            if(geojson.features[i].geometry.type === 'Point'){
                const coords = geojson.features[i].geometry.coordinates;
                so.plotPoint(coords,geojson.features[i].properties)
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

// Sets the center and zoom on the map
HereMap.prototype.setCenterAndZoomOnMap = function(center){
    var so = this;
    so.setCenter(center);
    so.map.setZoom(so.zoomLevel);
    so.map.setCenter(so.center);
}

// Plots a single point with coordinates
HereMap.prototype.plotPoint = function(coords,properties = {place: ""}) {
    var so = this;
    var icon = new H.map.Icon(so.icon);
    var marker = new H.map.Marker({lat: coords[1], lng: coords[0]},{icon});
    so.map.addObject(marker);
}

// gets the current zoom of the map
HereMap.prototype.getZoom = function(){
    return this.zoomLevel;
}

// Sets the zoom level of the map
HereMap.prototype.setZoom= function(zoom){
    this.zoomLevel = zoom;
}

// gets the current center of the map
HereMap.prototype.getCenter = function(){
    var so = this;
    return {lat: so.center.lat, lng: so.center.lng};
}

// Sets the center of the map
HereMap.prototype.setCenter = function(center){
    this.center = center;
}