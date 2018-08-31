var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    id: String,
    agree: Boolean,
    loginname: String,
    firstname: String,
    lastname: String,
    password: String,
    email: String,
    createTime: String,
    phoneNum: String,
    hearImgPath: String
});

module.exports = mongoose.model("User", schema);