import { Tracker } from 'meteor/tracker'
import { Session } from 'meteor/session'
import { Points } from '/common/points-collection'

let map = null;

export function loadMap(container){
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2NpbGFidXMiLCJhIjoiY2lzYjJvNmszMDE5NTJ1cGh6YTlpMjRyOSJ9.thJDMyzQrtgdqG6p56NvlQ';
    if (!mapboxgl.supported()) {
        Materialize.toast("Crap! Your browser does not support MapboxGL :'(");
    }else{
        map = new mapboxgl.Map({
            container: container, // container id
            style: 'mapbox://styles/mapbox/streets-v9', //stylesheet location
            center: [2.3522, 48.8566], // starting position
            zoom: 12 // starting zoom
        });

        map.on('load', () => { loadLayers(map) });
    }
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
            "icon-image": "embassy-15",
            "text-field": "{title}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.6],
            "text-anchor": "top"
        }
    });

    map.on('mousemove', function (e) {
        const features = map.queryRenderedFeatures(e.point, { layers: ['pointsLayer'] });
        map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
    });

    map.on('click', (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ['pointsLayer'] });
        if (features.length) {
            Session.set('selected-marker', features[0].properties.id);
            map.flyTo({center: features[0].geometry.coordinates});
        }else{
            Session.set('selected-marker', null);
        }
    });

    Tracker.autorun( () => {
        setData( Points.find() );
    });
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
            "icon": "star",
            "id": point._id
        }
    }});

    return {
        "type": "FeatureCollection",
        "features": features
    };
}
