export const Points = new Mongo.Collection('points');
Points.allow({
    'insert': function () {
        return true;
    }
});

export function insertNewPoint(point){
    if(validatePoint(point)){
        let e = Points.insert(point);
    }
}

function validatePoint(point) {
    // console.log(point);
    return true;
}
