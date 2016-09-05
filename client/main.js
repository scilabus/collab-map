import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker'

import { loadMap, setData } from './map/map'
import { processFile } from '/common/images-collection'
import { insertNewPoint } from '/common/points-collection'

import './main.html';

Meteor.startup(() => {
    Mapbox.load({
        gl: true
    })
});

Tracker.autorun(() => {
    if(Mapbox.loaded()) {
        loadMap('map');
    }
});

Meteor.subscribe("images");
Meteor.subscribe("points");

Template.registerHelper("log", function(msg){
    console.log(msg);
});
