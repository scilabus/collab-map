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

Template.edit_location.helpers({

});

Template.edit_location.events({
    "click #close-edit-location": exitEditLocationMode
});
