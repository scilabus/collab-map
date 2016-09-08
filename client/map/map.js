import { Tracker } from 'meteor/tracker'
import { Points } from '/common/points-collection'

let map = null;

export function loadMap(container){
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2NpbGFidXMiLCJhIjoiY2lzYjJvNmszMDE5NTJ1cGh6YTlpMjRyOSJ9.thJDMyzQrtgdqG6p56NvlQ';
    map = new mapboxgl.Map({
        container: container, // container id
        style: 'mapbox://styles/mapbox/streets-v9', //stylesheet location
        center: [2.3522, 48.8566], // starting position
        zoom: 12 // starting zoom
    });
    map.showCollisionBoxes = true;

    map.on('load', () => { loadLayers(map) });
    
    map.on('mousemove', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['pointsLayer'] });
        map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
    });
    map.on('click', (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ['pointsLayer'] });
        if (features.length) {
            onClickOnPlace(map, features[0]);
        }
    });
}

function loadLayers(map) {
    map.addSource("points", {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": []
        }
    });

    map.addLayer({
        "id": "pointsLayer",
        "type": "symbol",
        "source": "points",
        "layout": {
            "icon-image": "{icon}-15",
            "text-field": "{title}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.6],
            "text-anchor": "top"
        }
    });

    Tracker.autorun( () => {
        setData( Points.find() );
    });
}


function onClickOnPlace(map, place) {
    // Get coordinates from the symbol and center the map on those coordinates
    map.flyTo({center: place.geometry.coordinates});
}

export function flyTo(lat, long) {
    map.flyTo({center: [lat, long]});
}

export function setData(points) {
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
            "icon": "star"
        }
    }});

    return {
        "type": "FeatureCollection",
        "features": features
    };
}
