var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    id:Number,
    agree:Boolean,
    loginname:String,
    firstname:String,
    lastname:String,
    password:String,
    email:String,
    agreePolicy:Boolean,
    createTime:String,
    phoneNum:String,
    hearImgPath:String
});

module.exports = mongoose.model("User", schema);