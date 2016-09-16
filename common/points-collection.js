import { Session } from 'meteor/session'

export const Points = new Mongo.Collection('points');
Points.allow({
    'insert': function () {
        return true;
    }
});

export class Point {
    constructor() {
        this.id = null;
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

export function insertNewPoint(point){
    if(validatePoint(point)){
        let e = Points.insert(point);
    }
}
