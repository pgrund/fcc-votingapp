'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
// var requestIp = require('request-ip');

var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

// Configure view engine to render EJS templates.
// app.set('views', process.cwd() + '/app/views');
// app.set('view engine', 'ejs');

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/common', express.static(process.cwd() + '/app/common'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());
// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
	secret: 'secretFccVoting',
	resave: false,
  saveUninitialized: false,
	cookie: {
		httpOnly: false,
		secure: false
	}
}));

app.use(passport.initialize());
app.use(passport.session());


app.use('/public', express.static(process.cwd() + '/app/public'));

// inject ejs objects on render call
// app.use( function( req, res, next ) {
//     // grab reference of render
//     var _render = res.render;
//     // override logic
//     res.render = function( view, options, fn ) {
//         // do some custom logic
// 				var extendedOptions = Object.assign({}, options, { view: view, authenticated: req.isAuthenticated(), user: req.user, ip: req.ip});
//         // continue with original render
//         _render.call( this, view, extendedOptions, fn );
//     }
//     next();
// } );

routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
