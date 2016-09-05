var parser = require('exif-parser');
import { Session } from 'meteor/session'

export const ImagePath = "/tmp/uploads";
export const Images = new FS.Collection("images", {
  stores: [
      new FS.Store.FileSystem("images", {
        path: ImagePath,
        filter: {
            maxSize: 8*1024*1024, // in bytes
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
    }
});

function insertFile(file) {
    Images.insert(file, function (err, fileObj) {
        if(err){
            console.log(err);
            invalidFile(null, err);
        }else{
            Session.set('current-img', fileObj._id);
        }
    });
}

function invalidFile(file, e) {
    Materialize.toast("Image non valide, veuillez soumettre une image au format JPEG");
    Session.set('current-img', null);
}

export function processFile(file) {
        Materialize.toast(`Processing ${file.name} (${(file.size/(1024*1024)).toFixed(3)} MB)`, 500);
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