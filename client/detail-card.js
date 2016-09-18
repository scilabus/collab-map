import { Points } from '/common/points-collection'
import { Images } from '/common/images-collection'
import { enterEditPointMode } from '/client/upload-form'

Template.detail_card.events({
    'click .edit-mode-btn'() {
        enterEditPointMode(this._id);
    }
});

Template.detail_card.onRendered( () => {
    $('.tooltipped').tooltip({delay: 50});
});
