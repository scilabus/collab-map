import { Session } from 'meteor/session'
import { Images, processFile } from '/common/images-collection'
import { Point, setCurrentPoint, upsertPoint } from '/common/points-collection'
import { enterEditLocationMode } from '/client/edit-location'

Template.addnew.events({
    'click #show-add-new'(event, template) {
        clearForm(template.find("form"));
        $('#modal-add-new').openModal();
    },

    "submit form"(event, template) {
        event.preventDefault();

        const point = Point.getCurrentOrNew();

        point.title = event.target.title.value;
        point.date = event.target.date.value;
        point.links = {
            wikipedia: event.target.wikipedia.value || null,
        };
        point.description = event.target.description.value;
        point.status = "published";

        upsertPoint(point);

        // clearForm(event.target);
    },
    "click #cancel"(event, template) {
        clearForm(template.find("form"));
    }
});

Template.addnew.helpers({
    isInvalid: () => {
        return Session.get("upload-form-valid") != true;
    }
});

Template.addnewform.events({
    "change input[type=file]": function(event, template) {
        FS.Utility.eachFile(event, processFile);
    }
});

Template.addnewform.helpers({
    isImageSent: () => {
        return getCurrentImg() != null;
    }
});

Template.details.events({
    "click #edit-location": enterEditLocationMode,
    "change .required": () => {
        Session.set("upload-form-valid", !!$("input[name='title']").val() && !!$("input[name='coordinates']").val());
    }
});

export function enterEditPointMode(pointId) {
    const p = Point.getPoint(pointId);
    setCurrentPoint(p);
    $('#modal-add-new').openModal();
}

function getCurrentImg() {
    return Session.get('current-img') || null;
}

function clearForm(form) {
    Session.set('current-point', null);
    if(form){
        form.reset();
    }
}
