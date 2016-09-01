import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker'

import { loadMap, flyTo } from './map/map'

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

Template.addnew.events({
  'click #show-add-new'(event, instance) {
    console.log(event, instance);

    $('#modal-add-new').openModal();
  },
});

Template.sidebar.onRendered(function() {
    $("#show-menu").sideNav({
        closeOnClick: true
    });
});

Template.sidebar.events({
    'click #show-menu'(event, instance) {
        // console.log('clicked');
    },
    
    'click .place'(e, o){
        console.log(e);
        flyTo(null);
    }
});
