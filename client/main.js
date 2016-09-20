import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker'

import { loadMap } from '/client/map/map'
import { isEditLocationMode } from '/client/edit-location'
import { Point } from '/common/points-collection'

import './main.html';

FlowRouter.route('/admin', {
    name: 'admin',
    action: (params, queryParams) => {
        BlazeLayout.render('admin');
    }
});

FlowRouter.route('/point/:id', {
    name: 'map',
    action: (params, queryParams) => {
        const id = params.id;
        if(id && typeof(id) === "string" && id.length < 64){
            Point.setCurrentId(id);
        }
        BlazeLayout.render('map');
    }
});

FlowRouter.route('/', {
    name: 'map',
    action: (params, queryParams) => {
        BlazeLayout.render('map');
    }
});

Meteor.startup(() => {
    // loadMap('map');
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
    if(condition){
        return value;
    }else{
        return null;
    }
});

Template.map.onRendered(() => {
    loadMap('map');
})
