var Photo = require('../models/Photo');
var fs = require('fs');
var path1 = require('path');
var join = path1.join;

exports.form = function(req, res){
    res.render("photos/photos", {
        title:"Photo upload"
    })
}

exports.submit = function(dir){
    return function(req, res, next){
        var img = req.files.photo.image;
        var name = req.body.photo.name || img.name;
        var path = join(dir, img.name);
        fs.rename(img.path, path, function(err){
            if(err)return next(err);
            Photo.create({
                name:name,
                path:img.name
            },function(err){
                if(err)next(err);
                res.redirect("/");
            });
        });
    };
};

exports.list = function(req, res, next){
    Photo.find({}, function(err, photos){
        if(err)next(err);
        res.render('photos', {
            title:"Photos",
            photos:photos
        });
    });
};

exports.download = function(dir){
    return function(req, res, next){
        var id = req.params.id;
        Photo.findById(id, function(err, photo){
            if(err)next(err);
            var path = join(dir, photo.path);
            res.download(path, photo.name + ".jpg");
        });
        
    }
}