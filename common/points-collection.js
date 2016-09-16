import { Session } from 'meteor/session'

export const Points = new Mongo.Collection('points');
Points.allow({
    'insert': () => { return true },
    'update': () => { return true }
});

export class Point {
    constructor() {
        this.imgId = null;
        this.title = "";
        this.description = "";
        this.date = null;
        this.coord = {
            lat: null,
            long: null,
            confidence: 1
        };
        this.links = {
            wikipedia: ""
        };
        this.status = "published";
    }

    static getPoint(id) {
        return Points.findOne({_id: id});
    }

    static getCurrentOrNew() {
        return Session.get('current-point') || new Point();
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
