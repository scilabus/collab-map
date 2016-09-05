import { Meteor } from 'meteor/meteor';
import { read as readExif } from 'fast-exif';
import fs from 'fs';
import process from 'process';

import { ImagePath } from '../common/files.js'

Meteor.startup(() => {

});

Meteor.publish("getExifGPS", function(picture){
    readExif(picture)
        .then( (info) => {
            console.log(info);
            return info.exif;
        })
        .catch(console.error)
});

Meteor.methods({
    'where': () => {
        res = {
            'cwd': process.cwd(),
            'ls': fs.readdirSync('.')
        }
        console.log(res);
        return res;
    },
    'getExif'(picture) {
        readExif(picture)
            .then( (info) => {
                console.log(info.gps);
                return info.gps;
            })
            .catch(console.error);
    }
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
        //
        // const firstCopy = id.copies.images
        // const filename = `${ImagePath}/${firstCopy.key}`
        // console.log(filename);
        //
        // readExif(filename)
        //     .then( (info) => {
        //         console.log(info.gps);
        //         return info.gps;
        //     })
        //     .catch(console.error);
    },
    changed: function(id, fields){
        // console.log("CHANGED: ", id,"->", fields);
    },
    removed: function(id){
        // console.log("REMOVED: ", id);
    }
})
