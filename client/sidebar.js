import { Meteor } from 'meteor/meteor'
import { flyTo } from './map/map'

import {Points} from '/common/points-collection'

Template.sidebar.helpers({
    getPoints: () => {
        return Points.find();
    }
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

    'click .point'(event, template){
        console.log(e);
        flyTo(null);
    },
});
