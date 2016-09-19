import { Points } from '/common/points-collection'
import { Images } from '/common/images-collection'

Template.admin_login.events({
    'submit form': (e, t) => {
        e.preventDefault();
        const username = e.target.login.value.trim();
        const passwd = e.target.password.value.trim();
        login(username, passwd);
    }
});

Template.admin_points.helpers({
    getPoints: () => {
        return Points.find();
    }
});

Template.admin_points.events({
    'click #point-clear': (e, t) => {
        const id = e.target.dataset.id;
        if(id){
            Points.update({'_id': id}, {$set: {'status': 'unpublished'}});
        }
    },
    'click #point-delete': (e, t) => {
        const id = e.target.dataset.id;
        if(id){
            Points.remove(id);
        }
    }
});

Template.admin_images.helpers({
    getImages: () => {
        const imgToPoints = new Map();
        Points.find({}, {"imgId": 1}).map( (p) => {
            if(p.imgId){
                imgToPoints.set(p.imgId, p._id);
            }
        })

        return Images.find().map( (img) => {
            return _.extend(img, {pointId: imgToPoints.get(img._id)})
        });
    }
});

Template.admin_images.events({
    'click #img-delete': (e, t) => {
        const id = e.target.dataset.id;
        if(id){
            Images.remove(id);
        }
    }
});

function login(username, password) {
    Meteor.loginWithPassword(username, password, (e) => {
        if(e.reason){
            Materialize.toast(e.reason, 1000);
        }
    });
}
