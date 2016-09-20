import { Session } from 'meteor/session'
import { Images } from '/common/images-collection'

export const Points = new Mongo.Collection('points');
Points.allow({
    'insert': () => { return true },
    'update': () => { return true },
    'remove': () => { return !!Meteor.userId() }
});

const DefaultJSONContent = {
    imgId: null,
    title: "",
    description: "",
    date: null,
    coord: {
        lat: null,
        long: null,
        confidence: 1
    },
    links: {
        wikipedia: ""
    },
    status: "published",
};

export class Point {
    constructor(object) {
        if(object === null || object === undefined){
            Object.assign(this, DefaultJSONContent);
        }else{
            Object.assign(this, object);
        }
    }

    imgURL() {
        if(this.imgId){
            const img = Images.findOne({_id: this.imgId});
            if(img) {
                return img.url();
            }
        }

        return null;
    }

    save() {
        Session.set('current-point', this);
    }

    persist() {
        let id = this._id;
        // real upsert is not available from client side
        if(id && Points.findOne({_id: id})){
            Points.update({_id: id}, {$set: _.omit(this, '_id')});
        }else{
            id = Points.insert(this);
        }
        // not reusing point to refresh id (if we want to insert-edit)
        Object.assign(this, Point.getPoint(id));
        this.save();
    }

    static getPoint(id) {
        return new Point( Points.findOne({_id: id}) );
    }

    static getCurrentOrNew() {
        let p = Session.get('current-point');

        if(p) {
            if(typeof(p) == "string"){
                return Point.getPoint(p);
            }else if (p instanceof Point) {
                return p;
            }else if (p instanceof Object){
                return new Point(p);
            }
            console.warn("Unknown type ", typeof(p), p);
        }

        return new Point();
    }

    static clearCurrent() {
        Session.set('current-point', null);
    }

    static setCurrentId(id) {
        Session.set('current-point', id);
    }
}
