import { Meteor } from 'meteor/meteor';
import fs from 'fs';
import process from 'process';

import { Images, ImagePath } from '../common/images-collection'
import { Points } from '../common/points-collection'

Meteor.startup(() => {
});

Meteor.methods({
});

Meteor.publish("images", () => {
    return Images.find({});
});

Meteor.publish("points", () => {
    return Points.find({status: "published"});
});
