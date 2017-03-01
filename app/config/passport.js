'use strict';

var GitHubStrategy = require('passport-github').Strategy;
var Polls = require('../models/polls');
var configAuth = require('./auth');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		Polls.findById(id, function (err, user) {
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
			Polls.findOne({ 'github.id': profile.id }, function (err, user) {
				if (err) {
					return done(err);
				}

				if (user) {
					return done(null, user);
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

						return done(null, newEntry);
					});
				}
			});
		});
	}));
};
