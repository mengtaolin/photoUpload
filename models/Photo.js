var mongoose = require('mongoose');
mongoose.connect("mongodb://192.168.1.66:27017/photo_app", { useNewUrlParser: true });

var schema = new mongoose.Schema({
    name:String,
    path:String
});

module.exports = mongoose.model('Photo', schema);


