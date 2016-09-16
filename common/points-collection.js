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
        return Points.findOne({_id:id});
    }

    static getCurrentOrNew() {
        return Session.get('current-point') || new Point();
    }

    setAsCurrent() {
        return Session.set('current-point', this);
    }

    persist() {
        // upsert
    }

    validate() {
        //
    }
}

export function setCurrentPoint(point) {
    return Session.set('current-point', point);
}

export function upsertPoint(point){
    console.log("> inserting: ", point);
    // real upsert is not available from client side
    if(point._id && !!Points.findOne({_id:point._id})){
        const id = point._id;
        delete point._id;
        Points.update({_id: id}, {$set: point});
    }else{
        Points.insert(point);
    }
}
