import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker'

import { loadMap, flyTo } from './map/map'
import { processFile } from '../common/files.js'

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
    // console.log(event, instance);

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
        let data = Meteor.call("getExif", "data/test.jpg", function(error, result){
            if(error){
                console.log("error", error);
            }
            if(result){
                 console.log(result);
            }
        });
        // console.log('clicked');
    },

    'click .place'(e, o){
        console.log(e);
        flyTo(null);
    }
});


Template.addnewform.events({
    "change input[type=file]": function(event, template) {
        FS.Utility.eachFile(event, processFile);
    },
    "submit form": function(event, template){
        event.preventDefault();
    }
});
