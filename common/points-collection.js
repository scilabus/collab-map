import { Session } from 'meteor/session'
import { Images } from '/common/images-collection'

export const Points = new Mongo.Collection('points');
Points.allow({
    'insert': () => { return true },
    'update': () => { return true }
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
    constructor(json) {
        if(json === null || json === undefined){
            Object.assign(this, DefaultJSONContent);
        }else{
            Object.assign(this, json);
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
        if(id && !!Points.findOne({_id: id})){
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
        return new Point( Session.get('current-point') );
    }

    static clearCurrent() {
        Session.set('current-point', null);
    }
}

export function setCurrentPoint(point) {
    return Session.set('current-point', point);
}

export function upsertPoint(point){
    let id = point._id;

    // real upsert is not available from client side
    if(id && !!Points.findOne({_id: id})){
        delete point._id;
        Points.update({_id: id}, {$set: point});
    }else{
        id = Points.insert(point);
    }

    // not reusing point to refresh id (if we want to insert-edit)
    setCurrentPoint(Point.getPoint(id));
}
