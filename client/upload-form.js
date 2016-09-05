import { Session } from 'meteor/session'
import { Images, processFile } from '/common/images-collection'

Template.addnew.events({
    'click #show-add-new'(event, instance) {
        clearForm();
        $('#modal-add-new').openModal();
    },
    "submit form": function(event, template){
        event.preventDefault();
        console.log(event, template);

        const key = getCurrentImg();
        const point = {
            img: key,
            title: event.target.title.value,
            date: event.target.date.value,
            coordinates: event.target.coordinates.value,
            note: event.target.note.value,
            status: "published"
        }
        console.log(point);
        // insertNewPoint(...);
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
        const key = getCurrentImg();
        const img = Images.findOne(key);
        console.log(img);
        if(img && img.tags && img.tags.GPSLongitude && img.tags.GPSLatitude){
            return [img.tags.GPSLongitude, img.tags.GPSLatitude];
        }
        return null;
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
}
