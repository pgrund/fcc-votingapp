'use strict';

var GitHubStrategy = require('passport-github').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var Polls = require('../models/polls');
var configAuth = require('./auth');

module.exports = function (passport) {

	passport.serializeUser(function (user, done) {
    var sessionUser = {id: user.id, username: user.username, displayName: user.displayName, auth: user.auth}
		done(null, sessionUser);
	});

	passport.deserializeUser(function (sessionUser, done) {
    try {
      done(null, sessionUser);
    } catch(err) {
      done(err, sessionUser)
    };
	});

	passport.use(new GitHubStrategy({
		clientID: configAuth.githubAuth.clientID,
		clientSecret: configAuth.githubAuth.clientSecret,
		callbackURL: configAuth.githubAuth.callbackURL
	 },
	 function (token, refreshToken, profile, done) {
		process.nextTick(function () {
			Polls.findOne({ 'owner.id': profile.id }, function (err, poll) {
				if (err) {
					return done(err);
				}

				if (poll) {
					return done(null, poll.owner);
				} else {
					var newEntry = {
            id : profile.id,
            username : profile.username,
            displayName : profile.displayName,
            publicRepos : profile._json.public_repos,
            auth: 'github'
          };
          return done(null, newEntry);
				}
			});
		});
	 }));
  passport.use(new LocalStrategy(
    function(username, password, done) {
        if(username == password) {
          process.nextTick(function(){
            Polls.findOne({ 'owner.username': username }, function (err, poll) {
            	if (err) {
              	return done(err);
      				}

      				if (poll) {
                return done(null, poll.owner);
      				} else {
      					var newEntry = {
                  id : `user-${username.split('').map((s) => s.charCodeAt(0)).join('')}`,
      					  username : username,
                  displayName : `Test ${username}`,
                  auth: 'local'
                };
      					return done(null, newEntry);
      				}
            })
          });
        } else {
          console.log('username/password mismatch');
          return done(null, false);
        }
  }));
};
