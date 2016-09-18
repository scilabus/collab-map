import { Session } from 'meteor/session'
import { Point } from '/common/points-collection'
import {enterEditLocationMode as mapEnterEdit, exitEditLocationMode as mapExitEdit} from '/client/map/map.js'

export function enterEditLocationMode() {
    $('#modal-add-new').closeModal();

    Session.set("previous-mode", Session.get("mode") || null);
    Session.set("mode", "edit-location");

    const point = Point.getCurrentOrNew();
    Session.set("edit-location-lat", point.coord.lat);
    Session.set("edit-location-long", point.coord.long);
    Session.set("edit-location-confidence", point.coord.confidence);

    mapEnterEdit();
}

export function exitEditLocationMode(save = true) {
    if(save){
        const point = Point.getCurrentOrNew();
        point.coord = {
            lat: Session.get("edit-location-lat"),
            long: Session.get("edit-location-long"),
            confidence: Session.get("edit-location-confidence")
        }
        point.save();
    }

    Session.set("mode", Session.get("previous-mode") || null);
    Session.set("previous-mode", null);

    mapExitEdit();
    $('#modal-add-new').openModal();
}

export function isEditLocationMode() {
    return Session.get('mode') === "edit-location";
}

Template.edit_location.onRendered( () => {
    $('#precision').material_select();
});


Template.edit_location.helpers({
    getCurrentGPS: () => {
         return {long: Session.get('edit-location-lat'), lat: Session.get('edit-location-long')};
    }
});

Template.edit_location.events({
    "click #save-location": exitEditLocationMode,
    "click #cancel-location": () => { exitEditLocationMode(false) },
    "change #precision"(e) {
        try{
            const val = parseFloat(e.target.value);
            if(val){
                Session.set('edit-location-confidence', val);
            }
        }catch(_){}
    }
});
