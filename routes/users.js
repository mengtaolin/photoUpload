var dao = require("../models/UserDao");
const crypto = require("crypto");

exports.form = function(req, res, next){
  res.render('users/register', {
    title:"珍购网-新账号注册"
  })
}

exports.register = function(req, res, next){
  console.log(req);
  var body = req.body;
  var agree = body.agree;
  var email = body.email;
  var firstname = body.firstname;
  var lastname = body.lastname;
  var password = body.password;
  var loginname = body.loginname;

  var registCode = checkUser(agree, email, firstname, lastname, password);
  
  if(registCode == 0){
    let md5 = crypto.createHash('md5');
    password = md5.update(password).digest('hex');
    var id = (new Date());
    id = md5.update(id).digest('hex');
    dao.create({
      id:id,
      agree:agree == "on",
      email:email,
      loginname:loginname,
      firstname:firstname,
      lastname:lastname,
      password:password,
      createTime:new Date().toDateString(),
      phoneNum:"",
      hearImgPath:""
    })
  }
  else{
    res.header("200", {"Content-Type":"text/html"});
    res.end(registCode)
  }
  // res.redirect("/");
}

function checkUser(agree, email, firstname, lastname, password){
  if(agree == "on"){

  }
}

exports.checkEmail = function(req, res, next){
  console.log("check email!");
  console.log(req.body.email);
  dao.find({"email":req.body.email},function(err, doc){
    if(err)
    {
      next(err);
      return;
    }
    res.header("200", {"Content-Type":"text/html"});
    if(doc.length == 0){
      res.end("0");
    }
    else{
      res.end("1")
    }
  })
}


