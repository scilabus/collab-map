import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker'

import { loadMap, setData } from './map/map'
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

        // points = Images.find();
        // setData(points);
    }
});

Meteor.subscribe("points");

Template.addnew.events({
  'click #show-add-new'(event, instance) {
    // console.log(event, instance);

    $('#modal-add-new').openModal();
  },
});

Template.addnewform.events({
    "change input[type=file]": function(event, template) {
        FS.Utility.eachFile(event, processFile);
    },
    "submit form": function(event, template){
        event.preventDefault();
    }
});

Template.registerHelper("log", function(msg){
    console.log(msg);
});
