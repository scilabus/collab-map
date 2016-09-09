import { Points } from '/common/points-collection'
import { Images } from '/common/images-collection'

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
            console.log(`Point ${point.imgId} has no picture`);
            return null
        }

        return {
            title: point.title,
            note: point.note,
            user: "FirstName",
            wikipedia: point.links && point.links.wikipedia || null, // null propagation please!
            imgUrl: img.url()
        }
    }
});