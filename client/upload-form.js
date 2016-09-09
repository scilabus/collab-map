import { Session } from 'meteor/session'
import { Images, processFile } from '/common/images-collection'
import { insertNewPoint } from '/common/points-collection'

Template.addnew.events({
    'click #show-add-new'(event, instance) {
        clearForm();
        $('#modal-add-new').openModal();
    },
    "submit form": function(event, template){
        event.preventDefault();

        const key = getCurrentImg();
        const point = {
            imgId: key,
            title: event.target.title.value,
            date: event.target.date.value,
            coord: {
                long: Session.get('current-img-long') || null,
                lat: Session.get('current-img-lat') || null
            },
            links: {
                wikipedia: event.target.date.value || null,
            },
            note: event.target.note.value,
            status: "published"
        }

        insertNewPoint(point);
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
    getCurrentImgGPS: () => {
        return [Session.get('current-img-long').toFixed(3), Session.get('current-img-lat').toFixed(3)]
    },
    getCurrentImgDate: () => {
        const key = getCurrentImg();
        const img = Images.findOne(key);
        if(img && img.tags && img.tags.GPSDateStamp){
            return img.tags.GPSDateStamp;
        }
        return null;
    }
})

function getCurrentImg() {
    return Session.get('current-img') || null;
}

function clearForm() {
    Session.set('current-img', null);
    Session.set('current-img-lat', null);
    Session.set('current-img-long', null);
}
