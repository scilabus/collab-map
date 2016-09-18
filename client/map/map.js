import { Tracker } from 'meteor/tracker'
import { Session } from 'meteor/session'
import { Points } from '/common/points-collection'

let map = null;
let isEditLocationMode = false;
let isDragging = false;
let isCursorOverPoint = false;
let canvas = null;

export function loadMap(container){
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2NpbGFidXMiLCJhIjoiY2lzYjJvNmszMDE5NTJ1cGh6YTlpMjRyOSJ9.thJDMyzQrtgdqG6p56NvlQ';
    if (!mapboxgl.supported()) {
        Materialize.toast("Crap! Your browser does not support MapboxGL :'(");
    }else{
        map = new mapboxgl.Map({
            container: container, // container id
            style: 'mapbox://styles/scilabus/cisy4halw004t2wo0mnacdepj', //stylesheet location
            center: [2.3522, 48.8566], // starting position
            zoom: 12 // starting zoom
        });

        map.on('load', () => { loadLayers(map) });
        canvas = map.getCanvasContainer();
    }
}

const editLocationMarker = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [2.3562, 48.8596]
        }
    }]
};

function loadLayers(map) {
    // main layer
    map.addSource("points", {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": []
        }
    });

    map.addLayer({
        "id": "points-layer",
        "type": "symbol",
        "source": "points",
        "layout": {
            "icon-image": "marker-red",
            "text-field": "{title}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.6],
            "text-anchor": "top"
        }
    });

    // edit location layer
    map.addSource('edit-location', {
        "type": "geojson",
        "data": editLocationMarker
    });

    map.addLayer({
        "id": "edit-location",
        "type": "symbol",
        "source": "edit-location",
        "layout": {
            "visibility": "none",
            "icon-image": "marker-blue",
        },
    });

    // geocoder
    const geocoder = new mapboxgl.Geocoder({
        container: "geo-search",
        placeholder: "Rechercher",
        country: "fr",
        types: "poi,address"
    });
    map.addControl(geocoder);

    Tracker.autorun( () => {
        setData( Points.find() );
    });

    map.on('mousemove', onMouseMove);
    map.on('click', onClick);
    map.on('mousedown', onMouseDown, true);

    geocoder.on('result', (e) => {
        console.log(e);
        editLocationMarker.features[0].geometry= e.result.geometry;
        map.getSource('edit-location').setData(editLocationMarker);

        Session.set('edit-location-long', e.result.geometry.coordinates[0]);
        Session.set('edit-location-lat', e.result.geometry.coordinates[1]);
    })

    // display the rest
    Session.set('map-loaded', true);
}

export function flyTo(lat, long) {
    map.flyTo({center: [lat, long]});
}

export function enterEditLocationMode(){
    isEditLocationMode = true;

    $("#show-menu").hide();
    $("#geo-search").show();

    const lng = Session.get('edit-location-long') || map.getCenter().lng;
    const lat = Session.get('edit-location-lat') || map.getCenter().lat;

    editLocationMarker.features[0].geometry.coordinates = [lng, lat];
    map.getSource('edit-location').setData(editLocationMarker);

    map.setLayoutProperty('edit-location', 'visibility', 'visible');
    map.setLayoutProperty('points-layer', 'visibility', 'none');

}

export function exitEditLocationMode(){
    map.setLayoutProperty('edit-location', 'visibility', 'none');
    map.setLayoutProperty('points-layer', 'visibility', 'visible');

    $("#geo-search").hide();
    $("#show-menu").show();

    isEditLocationMode = false;
}

function setData(points) {
    map.getSource("points").setData( buildGeoJson(points) );
}

function buildGeoJson( cursor ) {
    const features = cursor.map( (point) => { return {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [point.coord.long, point.coord.lat]
        },
        "properties": {
            "title": point.title,
            "icon": "star",
            "id": point._id
        }
    }});

    return {
        "type": "FeatureCollection",
        "features": features
    };
}

// mouse events
function onMouseMove(e) {
    if(isEditLocationMode){
        const features = map.queryRenderedFeatures(e.point, { layers: ['edit-location'] });
        if (features.length) {
            canvas.style.cursor = 'move';
            isCursorOverPoint = true;
            map.dragPan.disable();
        } else {
            canvas.style.cursor = '';
            isCursorOverPoint = false;
            map.dragPan.enable();
        }
    }else{
        const features = map.queryRenderedFeatures(e.point, { layers: ['points-layer'] });
        canvas.style.cursor = (features.length) ? 'pointer' : '';
    }
}

function onClick(e) {
    const features = map.queryRenderedFeatures(e.point, { layers: ['points-layer'] });
    if (features.length) {
        Session.set('selected-marker', features[0].properties.id);
        map.flyTo({center: features[0].geometry.coordinates});
    }else{
        Session.set('selected-marker', null);
    }
}

function onMouseDown() {
    if (!isEditLocationMode || !isCursorOverPoint)
        return;

    isDragging = true;
    canvas.style.cursor = 'grab';

    // Mouse events
    map.on('mousemove', onMove);
    map.on('mouseup', onUp);
}


function onMove(e) {
    if (!isEditLocationMode || !isDragging)
        return;

    canvas.style.cursor = 'grabbing';
    editLocationMarker.features[0].geometry.coordinates = [e.lngLat.lng, e.lngLat.lat];
    map.getSource('edit-location').setData(editLocationMarker);
}

function onUp(e) {
    if (!isEditLocationMode || !isDragging)
        return;

    Session.set('edit-location-long', e.lngLat.lng);
    Session.set('edit-location-lat', e.lngLat.lat);

    canvas.style.cursor = '';
    isDragging = false;
}
