var express = require('express');
var router = express.Router();
var Photo = require('../models/Photo');
var fs = require('fs');
var path1 = require('path');
var join = path1.join;
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var rootPath = path1.join(__dirname, "../public/images");
var app = require("../app");
console.log("images == ", app)

form = function(req, res){
    res.render("photos/photos", {
        title:"Photo upload"
    })
}

submit = function(dir){
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

list = function(req, res, next){
    Photo.find({}, function(err, photos){
        if(err)next(err);
        res.render('photos', {
            title:"Photos",
            photos:photos
        });
    });
};

download = function(dir){
    return function(req, res, next){
        var id = req.params.id;
        Photo.findById(id, function(err, photo){
            if(err)next(err);
            var path = join(rootPath, photo.path);
            res.download(path, photo.name + ".jpg");
        });
        
    }
}

router.get('/upload', form);
router.post('/upload', multipartMiddleware, submit(rootPath));
router.get("/photo/:id/download", download(rootPath));
router.get("/", list);

module.exports = router;