import { Points } from '/common/points-collection'
import { Images } from '/common/images-collection'
import { enterEditPointMode } from '/client/upload-form'

Template.detail_card.helpers({
    getSelectedMarker: () => {
        // close card if opened
        // no method for this, let's tickle .card (https://github.com/Dogfalo/materialize/blob/master/js/cards.js)
        $(".card-reveal .card-title").trigger("click");

        const id = Session.get("selected-marker");
        if(!id)
            return null;

        const point = Points.findOne({_id: id});
        if(!point)
            return null;

        const img = Images.findOne({_id: point.imgId});
        if(!img){
            console.log(`Point ${point._id} has no picture`);
            return null
        }

        return {
            title: point.title,
            id: id,
            description: point.description,
            user: "FirstName",
            wikipedia: point.links && point.links.wikipedia || null, // null propagation please!
            imgUrl: img.url()
        }
    }
});

Template.detail_card.events({
    'click .edit-mode-btn'() {
        enterEditPointMode(this.id);
    }
});

Template.detail_card.onRendered( () => {
    $('.tooltipped').tooltip({delay: 50});
});
