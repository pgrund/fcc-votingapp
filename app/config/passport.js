'use strict';

var GitHubStrategy = require('passport-github').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var Polls = require('../models/polls');
var configAuth = require('./auth');

module.exports = function (passport) {

	passport.serializeUser(function (user, done) {
		done(null, JSON.stringify(user));
	});

	passport.deserializeUser(function (id, done) {
    try {
      done(null, JSON.parse(id));
    } catch(err) {
      done(err, id)
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

				if (user) {
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
                  id : `user-${(new Date()).getTime()}`,
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
