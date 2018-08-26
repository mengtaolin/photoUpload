var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('images', __dirname + "/public/images");

// var photos = require("./routes/photos");
var photos = require('./routes/photos1');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
// app.use('/', photos);
app.get("/hello", function(req, res){
  res.send("hello")
});
app.get("/", photos.list);
app.get("/upload", photos.form);
app.post("/upload", multipartMiddleware, photos.submit(app.get('images')));
app.get("/photo/:id/download", photos.download);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
