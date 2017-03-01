'use strict';

var GitHubStrategy = require('passport-github').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var Polls = require('../models/polls');
var configAuth = require('./auth');

module.exports = function (passport) {

  console.log('passport init');

	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		Polls.find({ 'owner.id' : id}, function (err, user) {
			done(err, user);
		});
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
					var newEntry = new Poll();

					newEntry.owner.id = profile.id;
					newEntry.owner.username = profile.username;
					newEntry.owner.displayName = profile.displayName;
					newEntry.owner.publicRepos = profile._json.public_repos;
					newEntry.poll.created = Date.now();
          newEntry.poll.options = [];

					newEntry.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newEntry.owner);
					});
				}
			});
		});
	 }));
  passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log('auth for local', username, password);
        if(username == password) {
          process.nextTick(function(){
            Polls.findOne({ 'owner.username': username }, function (err, poll) {
              console.log('lookup returned ..');
      				if (err) {
                console.error('error', JSON.stringify(err));
      					return done(err);
      				}

      				if (poll) {
                console.log('user found', poll);
      					return done(null, poll.owner);
      				} else {
      					var newEntry = {
                  id : `user-${(new Date()).getTime()}`,
      					  username : username,
                  displayName : `Test ${username}`,
                  publicRepos : 0
                };
      					return done(null, newEntry);
      				}
            })
          });
          console.log('should never hit');

        } else {
          console.log('username/password mismatch');
          return done(null, false);
        }
  }));
};
