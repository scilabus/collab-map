const parser = require('exif-parser');
import { Session } from 'meteor/session'
import { Point, setCurrentPoint } from '/common/points-collection'

export const ImagePath = "~/data/images";
export const Images = new FS.Collection("images", {
  stores: [
      new FS.Store.FileSystem("images", {
        path: ImagePath,
        filter: {
            maxSize: 2*1024*1024, // in bytes
            allow: {
                contentTypes: ['image/*'],
            }
        }
      })
    ]
});

Images.allow({
    'insert': function () {
        return true;
    },
    'update': function () {
        return true;
    },
    'download': function () {
        return true;
    }
});

function insertFile(file) {
    Images.insert(file, function (err, fileObj) {
        if(err){
            console.log(err);
            invalidFile(null, err);
        }else{
            const point = new Point();
            point.imgId = fileObj._id;

            // Session.set('current-img', fileObj._id);

            if(fileObj.tags && fileObj.tags.GPSLongitude && fileObj.tags.GPSLatitude){
                point.coord = {
                    lat: fileObj.tags.GPSLatitude,
                    long: fileObj.tags.GPSLongitude,
                    confidence: 1
                }
                // Session.set('current-img-lat', fileObj.tags.GPSLatitude);
                // Session.set('current-img-long', fileObj.tags.GPSLongitude);
            }
            setCurrentPoint(point);
        }
    });
}

function invalidFile(file, e) {
    Materialize.toast("Image non valide, veuillez soumettre une image au format JPEG", 3000);
    Session.set('current-img', null);
}

export function processFile(file) {
        Materialize.toast(`Traitement de ${file.name} (${(file.size/(1024*1024)).toFixed(3)} MB)`, 800);
        let reader = new FileReader();

        reader.onerror = invalidFile;
        reader.onloadend = e => {
            let result;
            try {
                result = parser.create(reader.result).parse();
            }
            catch(exc) {
                invalidFile(exc);
            }

            let FSFile = new FS.File(file);
            // enrich file with Exif tag
            FSFile.tags = result.tags;
            // console.log(FSFile);
            insertFile(FSFile);
        };

        reader.readAsArrayBuffer(file.slice(0, 65635));
}
