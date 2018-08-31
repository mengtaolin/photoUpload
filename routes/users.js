var dao = require("../models/UserDao");
const crypto = require("crypto");
const fs = require('fs');

var htmls = {};
/**
 * 返回注册节目
 * @param {*} url 
 */
exports.registerForm = function(url) {
    url = url + "/regist.html";
    return function(req, res, next) {
        respose(url, req, res, next);
    }
}

/**
 * 返回登陆界面
 * @param {*} url 
 */
exports.loginFrom = function(url) {
    url = url + "/login.html"
    return function(req, res, next) {
        respose(url, req, res, next);
    }
}

/**
 * 返回忘记密码界面
 * @param {*} url 
 */
exports.forgetPswForm = function(url) {
    url = url + "/forgetPsw.html";
    return function(req, res, next) {
        respose(url, req, res, next);
    }
}



/**
 * 加载并解析和缓存对应的静态html界面，下次返回直接在缓存中读取
 * @param {*} url 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function respose(url, req, res, next) {
    if (htmls.hasOwnProperty(url) == false) {
        fs.readFile(url, function(err, data) {
            if (err) {
                next(err);
                return;
            }
            var html = data.toString();
            htmls[url] = html;
            res.header('200', { 'Content-Type': 'text/html' });
            res.end(html);
        })
    } else {
        res.header('200', { 'Content-Type': 'text/html' });
        res.end(htmls[url]);
    }
}

exports.register = function(req, res, next) {
    console.log(req);
    var body = req.body;
    var agree = body.agree;
    var email = body.email;
    var firstname = body.firstname;
    var lastname = body.lastname;
    var password = body.password;
    var loginname = body.loginname;
    var phoneNum = body.phoneNum;
    var repeadpsw = body.retype_password;

    // checkUser(agree, email, firstname, lastname, password, loginname, phoneNum, repeadpsw, registerRes);
    // registerRes(0);

    // function registerRes(registCode) {
    var registCode = 0;
    if (registCode == 0) {
        let md5 = crypto.createHash('md5');
        password = md5.update(password).digest('hex').toString();
        var buf = crypto.randomBytes(16);
        var id = buf.toString('hex');
        dao.create({
            id: id,
            agree: agree == "on",
            loginname: loginname,
            firstname: firstname,
            lastname: lastname,
            password: password,
            email: email,
            createTime: new Date().toDateString(),
            phoneNum: phoneNum,
            hearImgPath: ""
        }, function(err, doc) {
            if (err) {
                next(err);
                return;
            }
            resposeCode(res, 0);
        })
    } else {
        resposeCode(res, registCode);
    }
    // }
}

function resposeCode(res, code) {
    res.header("200", { "Content-Type": "text/html" });
    res.json({ code: code });
    res.end();
}

var regExp = /^((([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})[; ,])*(([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})))$/;
var phoneReg = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\\d{8}$/;
/**
 * 检测提交内容
 * @param {*} agree 
 * @param {*} email 
 * @param {*} firstname 
 * @param {*} lastname 
 * @param {*} password 
 * @param {*} loginname 
 * @param {*} phoneNum 
 * @param {*} repeadpsw 
 * @param {*} cb 
 */
function checkUser(agree, email, firstname, lastname, password, loginname, phoneNum, repeadpsw, cb) {
    if (agree == "off") {
        cb(1);
    }
    if (firstname.length < 2) {
        cb(2);
    }
    if (password != repeadpsw) {
        cb(3);
    }
    if (regExp.test(password) == false) {
        cb(4);
    }
    dao.find({ 'email': email }, function(err, data1) {
        if (err) {
            cb(9);
            return;
        }
        if (data1.length > 0) {
            cb(5);
        } else {
            dao.find({ "loginname": loginname }, function(err, data2) {
                if (err) {
                    cb(9);
                    return;
                }
                if (data2.length > 0) {
                    cb(6);
                } else {
                    dao.find({ 'phoneNum': phoneNum }, function(err, data3) {
                        if (err) {
                            cb(9);
                            return;
                        }
                        if (data3.length > 0) {
                            cb(7);
                        } else {
                            cb(0); //可注册
                        }
                    })
                }
            });
        }
    })
}
/**
 * 检测邮箱是否被注册
 * @param {*} req 请求内容
 * @param {*} res 回复内容
 * @param {*} next 下一个调用方法
 */
exports.checkEmail = function(req, res, next) {
    console.log(req.body.email);
    dao.find({ "email": req.body.email }, function(err, doc) {
        if (err) {
            next(err);
            return;
        }
        res.header("200", { "Content-Type": "text/html" });
        res.end(doc.length == 0 ? "0" : "1");
    })
}

/**
 * 检测登陆名称是否已经被注册
 * @param {*} req 请求内容
 * @param {*} res 回复内容
 * @param {*} next 下一个调用方法
 */
exports.checkLoginName = function(req, res, next) {
    console.log(req.body.loginname);
    dao.find({
        'loginname': req.body.loginname
    }, function(err, doc) {
        if (err) {
            next(err);
            return;
        }
        res.header('200', { 'Content-Type': 'text/html' });
        res.end(doc.length == 0 ? "0" : "1");
    });
}

/**
 * 检测登陆手机号码是否已经被注册
 * @param {*} req 请求内容
 * @param {*} res 回复内容
 * @param {*} next 下一个调用方法
 */
exports.checkPhoneNum = function(req, res, next) {
    console.log(req.body.phoneNum);
    dao.find({
        'phoneNum': req.body.phoneNum
    }, function(err, doc) {
        if (err) {
            next(err);
            return;
        }
        res.header('200', { 'Content-Type': 'text/html' });
        res.end(doc.length == 0 ? "0" : "1");
    });
}


exports.login = function(req, res, next) {
    var loginWay = req.body.loginWay;
    var password = req.body.password;
    var fields = { password: 1 };
    var options = {};
    if (phoneReg.test(loginWay)) { //手机号码登陆
        fields['phoneNum'] = 1;
        dao.find({ phoneNum: loginWay }, fields, options, function(err, doc) {
            if (err) {
                next(err);
                return;
            }
            console.log(doc);
        });
    } else if (regExp.test(loginWay)) { //邮箱登陆
        fields['email'] = 1;
        dao.find({
            email: loginWay
        }, fields, options, function(err, doc) {

        })
    } else { //用户名登陆
        fields['usernam'] = 1;
        dao.find({
            loginname: loginWay
        }, fields, options, function(err, doc) {
            if (err) {
                resposeCode(res, 4);
                return;
            }
            if (doc.length == 1) { //
                password = md5.update(password).digest('hex').toString();
                var model = doc[0];
                if (password == model.password) {
                    resposeCode(res, 0);
                } else {
                    resposeCode(res, 1);
                }
            } else if (doc.length == 0) {
                resposeCode(res, 2);
            } else {
                resposeCode(res, 3);
            }
        })
    }
}

exports.forgetPsw = function(req, res, next) {

}