import { Session } from 'meteor/session'

Template.edit_location.helpers({

});

Template.edit_location.events({
    "click #close-edit-location"(e, t){
        Session.set("mode", "normal");
        $('#modal-add-new').openModal();
    }
});
