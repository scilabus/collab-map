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

        if(!point.title || !point.coord.lat || !point.coord.long) {
            Materialize.toast(`Veuillez entrer un titre et des coordonnées au minimum`, 3000);
        }else{
            point.persist()
            $('#modal-add-new').closeModal();
        }

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

Template.uploadform.events({
    "change input[type=file]": function(event, template) {
        FS.Utility.eachFile(event, processFile);
    },
    "click #add-img-upload": () => {
        $("#file-upload").click();
    },
    "click #edit-location": enterEditLocationMode
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
