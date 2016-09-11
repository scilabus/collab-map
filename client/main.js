import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker'

import { loadMap } from '/client/map/map'
import { isEditLocationMode } from '/client/edit-location'
import { processFile } from '/common/images-collection'
import { insertNewPoint } from '/common/points-collection'

import './main.html';

Meteor.startup(() => {
    loadMap('map');
});

Tracker.autorun(() => {
});

Meteor.subscribe("images");
Meteor.subscribe("points");

Template.registerHelper("log", function(msg){
    console.log(msg);
});

Template.registerHelper("mapLoaded", function(msg){
    return !!Session.get('map-loaded');
});

Template.registerHelper("isEditLocationMode", function(msg){
    return isEditLocationMode();
});

Template.registerHelper("formatGps", function(coords){
    if(!coords || coords.length != 2 || !coords[0] || !coords[1]){
        return "";
    }else{
        return `(${coords[0].toFixed(3)}, ${coords[1].toFixed(3)})`;
    }
});

Template.registerHelper("getCurrentGPS", function(){
    return [Session.get('current-img-long'), Session.get('current-img-lat')];
});
