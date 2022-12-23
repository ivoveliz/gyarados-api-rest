var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var organizationRouter = require('./routes/organization');
var uplinksRouter = require('./routes/uplinks');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var mongoose = require('mongoose');
const dotenv = require("dotenv")
dotenv.config()
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/organization', organizationRouter);
app.use('/uplinks', uplinksRouter);

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


mongoose.connect(process.env.COSMOSDBSTRING,  {
  useNewUrlParser:true
})
var conn = mongoose.connection;
conn.on('connected', function() {
  console.log('database is connected successfully');
});
conn.on('disconnected',function(){
  console.log('database is disconnected successfully');
})
conn.on('error', console.error.bind(console, 'connection error:'));

module.exports = app;
