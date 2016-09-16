import { Session } from 'meteor/session'

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

    static getPoint(id) {
        return new Point( Points.findOne({_id: id}) );
    }

    static getCurrentOrNew() {
        return new Point( Session.get('current-point') );
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
