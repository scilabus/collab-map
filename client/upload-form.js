import { Session } from 'meteor/session'
import { Images, processFile } from '/common/images-collection'
import { Point, setCurrentPoint, insertNewPoint } from '/common/points-collection'
import { enterEditLocationMode } from '/client/edit-location'

Template.addnew.events({
    'click #show-add-new'(event, template) {
        clearForm(template.find("form"));
        $('#modal-add-new').openModal();
    },

    "submit form"(event, template) {
        event.preventDefault();

        // const key = getCurrentImg();
        const point = Point.getCurrentOrNew();

        // point.imgId: key,
        point.title = event.target.title.value;
        point.date = event.target.date.value;
        // point.coord -> already set by pict upload of GPS edition
        point.links = {
            wikipedia: event.target.wikipedia.value || null,
        };
        point.note = event.target.description.value;
        point.status = "published";

        insertNewPoint(point);

        // clearForm(event.target);
    },
    "click #cancel"(event, template) {
        clearForm(template.find("form"));
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
})

Template.details.helpers({
    getCurrentPoint: () => {
        return Point.getCurrentOrNew();
    },
    ifThen: (condition, value) => {
        if(!!condition){
            return value;
        }else{
            return null;
        }
    }
});

Template.details.events({
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
