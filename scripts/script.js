let googleMap = new GoogleMap();
let mapbox = new Mapbox();
let applemap = new AppleMap();
let heremap = new HereMap();

let baseMapOptions = {
    googleMap : 'google-map',
    mapbox: 'mapbox',
    appleMap: 'apple-map',
    hereMap : 'here-map'
}

let inputTypeOptions = {
    geoJson: 'geojson',
    listOfLatLngValues: 'lat-lng',
    addresses: 'addresses'
}

// Map level settings
let zoomLevel = 12;
let center = {"lat": 37.4047403, "lng": -122.0166661};

let selectedBaseMap = baseMapOptions.googleMap;

let selectMapDropDown = $('#select-base-map');
let btnUpdateMap = $('#update-map');
let textarea = $('#textarea-lat-lng');
let selectInputType = $('#select-input-type');

let dataHistory = []; // keeps the history of data.

// Functions
$(document).ready(function() {
    initMap(getSelectedMapBaseObject())

    selectMapDropDown.on('change',baseMapDropDownChange);
    btnUpdateMap.on('click',onUpdateMapButtonClick);
});

// Hanldes on change event of the drop down change of base map.
function baseMapDropDownChange(e){
    // Sets the latest zoom and center from the base object before destroying
    setLatestZoomAndCenter();
    setSelectedMapBaseObject(selectMapDropDown.val());
    var base = getSelectedMapBaseObject();
    removeMapArea();
    initMap(base);
}

// Hanldes click event of the update map button.
function onUpdateMapButtonClick(e){
    let text = '';
    let obj = null;
    if(selectInputType.val() == inputTypeOptions.addresses){
        
    }
    else if(selectInputType.val() == inputTypeOptions.listOfLatLngValues){
        try{
            text = textarea.val().replace(/\s/g, '');
            obj = convertStringToGeoJon(text);
        }
        catch(e){
            alert('Error Occured. Please check input.');
            return;
        }
    }
    else if(selectInputType.val() == inputTypeOptions.geoJson){
        try{
            text = textarea.val().replace(/\s/g, '');
            obj = JSON.parse(text);
        }
        catch(e){
            alert('GeoJson not in correct format. Please recheck.');
            console.log(e);
            return;
        }
    }

    var base = getSelectedMapBaseObject();

    mapFunctions(base,obj);
    dataHistory.push(obj);
}

// Sets the latest zoom and center from the base object
function setLatestZoomAndCenter(){
    const selectedBaseMap = getSelectedMapBaseObject();
    zoomLevel = selectedBaseMap.getZoom();
    center = selectedBaseMap.getCenter();
}

// Removes the div with id map and creates a new html element for a new base map.
function removeMapArea(){
    var parent = $('#map-area');
    parent.empty();
    var div = document.createElement("div");
    div.setAttribute("id", "map");
    parent.append(div);
}

// Initialize map
function initMap(baseMap){
    baseMap.setZoom(zoomLevel);
    baseMap.setCenter(center);
    baseMap.init();
    mapFunctions(baseMap);
}

// Contains all the functions that are to be for a particular map.
function mapFunctions(baseMap,obj={}){
    // If a new object is passed, plot obj content else plot content from history
    if(Object.keys(obj).length > 0){
        baseMap.plotPoints(obj);
    }
    else{
        dataHistory.forEach((o)=>{
            baseMap.plotPoints(o);
        });
    }
}

// Sets the selected base map object
function setSelectedMapBaseObject(text){
    if(text == baseMapOptions.googleMap){
        selectedBaseMap = baseMapOptions.googleMap;
    }
    else if(text == baseMapOptions.mapbox){
        selectedBaseMap = baseMapOptions.mapbox;
    }
    else if(text == baseMapOptions.appleMap){
        selectedBaseMap = baseMapOptions.appleMap;
    }
    else if(text == baseMapOptions.hereMap){
        selectedBaseMap = baseMapOptions.hereMap;
    }
}

// gets the current base map object selected
function getSelectedMapBaseObject(){
    if(selectedBaseMap == baseMapOptions.googleMap){
        return googleMap;
    }
    else if(selectedBaseMap == baseMapOptions.mapbox){
        return mapbox;
    }
    else if(selectedBaseMap == baseMapOptions.appleMap){
        return applemap;
    }
    else if(selectedBaseMap == baseMapOptions.hereMap){
        return heremap;
    }
}

// converts a string into geojson
function convertStringToGeoJon(str){
    let obj = JSON.parse(str);
    let geoJson = {
        type: 'FeatureCollection',
        features : [],
    };

    // If we have array of points
    if(Array.isArray(obj)){
        obj.forEach(o=>{
            geoJson.features.push(
                getSingleObjectGeoJson([
                    o.lng ? o.lng:o.longitude,
                    o.lat ? o.lat:o.latitude,
                ],'Point')
            );
        });
    }
    // If we have one single point.
    else{
        return getSingleObjectGeoJson([
            obj.lng ? obj.lng:obj.longitude,
            obj.lat ? obj.lat:obj.latitude,
        ],'Point');
    }

    return geoJson;
}

// Gets a single GeoJson object for coords and type
function getSingleObjectGeoJson(coords, type){
    let geoJson = {
        type: 'Feature',
        geometry:{
            type: type,
            coordinates: coords,
        }
    };
    return geoJson;
}

// Demo object
// {
//     "lat": -32.202924,
//     "lng": -64.404945
// }

// {
//     "type": "Feature",
//     "geometry": {
//       "type": "Point",
//       "coordinates": [125.6, 10.1]
//     },
//     "properties": {
//       "name": "Dinagat Islands"
//     }
//   }