import { Meteor } from 'meteor/meteor';
import fs from 'fs';
import process from 'process';

import { ImagePath } from '../common/files.js'

Meteor.startup(() => {

});

Meteor.methods({
});

Images.allow({
  'insert': function () {
    // add custom authentication code here
        return true;
    },
    'update': function () {
        // add custom authentication code here
        return true;
    },
});

var images = Images.find();
images.observe({
    added: function(id, fields){
        console.log("ADDED: ", id, "->", fields);
    },
    changed: function(id, fields){
        // console.log("CHANGED: ", id,"->", fields);
    },
    removed: function(id){
        // console.log("REMOVED: ", id);
    }
})


Meteor.publish("points", () => {
    return Images.find({});
});
