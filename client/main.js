import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker'

import { loadMap } from '/client/map/map'
import { isEditLocationMode } from '/client/edit-location'
import { Point } from '/common/points-collection'

import './main.html';

Meteor.startup(() => {
    loadMap('map');
});

Tracker.autorun(() => {
});

Meteor.subscribe("images");
Meteor.subscribe("points");

Template.registerHelper("log", (msg) => {
    console.log(msg);
});

Template.registerHelper("mapLoaded", (msg) => {
    return !!Session.get('map-loaded');
});

Template.registerHelper("isEditLocationMode", (msg) => {
    return isEditLocationMode();
});

Template.registerHelper("formatGps", (coords) => {
    if(!coords || coords.length < 2 || !coords.lat || !coords.long){
        return "";
    }else{
        return `(${coords.lat.toFixed(3)}, ${coords.long.toFixed(3)})`;
    }
});

Template.registerHelper("getCurrentPointOrNull", () => {
        const p = Point.getCurrentOrNew();
        if(!p._id){
            return null;
        }else{
            return p;
        }
});

Template.registerHelper("getCurrentPoint", () => {
        return Point.getCurrentOrNew();
});

Template.registerHelper("ifThen", (condition, value) => {
    if(!!condition){
        return value;
    }else{
        return null;
    }
});
