import { Meteor } from 'meteor/meteor'
import { flyTo } from './map/map'

import { Points, Point } from '/common/points-collection'

Template.sidebar.helpers({
    getPoints: () => {
        return Points.find();
    }
});

Template.sidebar.onRendered(function() {
    $("#show-menu").sideNav({
        menuWidth: 350,
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
    },

    'click .nav-point'(event, template){
        const lat = parseFloat(event.currentTarget.dataset.lat);
        const long = parseFloat(event.currentTarget.dataset.long);
        Point.setCurrentId(event.currentTarget.dataset.id);
        flyTo(long, lat);
    },
});
