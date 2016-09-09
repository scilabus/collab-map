import { Points } from '/common/points-collection'
import { Images } from '/common/images-collection'

Template.detail_card.helpers({
    getSelectedMarker: () => {
        const id = Session.get("selected-marker");
        if(!id)
            return null;

        const point = Points.findOne({_id: id});
        if(!point)
            return null;

        const img = Images.findOne({_id:point.imgId});
        if(!img){
            console.log(`Point ${point.imgId} has no picture`);
            return null
        }


        console.log(img);

        return {
            title: point.title,
            note: point.note,
            imgUrl: img.url()
        }
    }
});

Template.detail_card.events({
});
