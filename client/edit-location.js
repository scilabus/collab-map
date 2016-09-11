import { Session } from 'meteor/session'
import {enterEditLocationMode as mapEnterEdit, exitEditLocationMode as mapExitEdit} from '/client/map/map.js'

export function enterEditLocationMode() {
    $('#modal-add-new').closeModal();

    Session.set("previous-mode", Session.get("mode") || null);
    Session.set("mode", "edit-location");

    mapEnterEdit();
}

export function exitEditLocationMode() {
    mapExitEdit();

    Session.set("mode", Session.get("previous-mode") || null);
    Session.set("previous-mode", null);

    $('#modal-add-new').openModal();
}

export function isEditLocationMode() {
    return Session.get('mode') === "edit-location";
}

Template.edit_location.onRendered( () => {
    $('#precision').material_select();
});

Template.edit_location.events({
    "click #close-edit-location": exitEditLocationMode,
    "change #precision"(e) {
        try{
            const val = parseFloat(e.target.value);
            if(val){
                Session.set('current-coord-confidence', val);
            }
        }catch(_){}
    }
});
