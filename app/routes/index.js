'use strict';

var path = process.cwd();
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
      console.log('not authenticated');
      // res.redirect('/login');
      req.user = {
      	 "id": "githubid",
    	   "displayName": "name",
    	   "username": "username",
         "publicRepos": 0
      };
      return next();
		}
	}

  var pollHandler = new PollHandler();

	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/polls')
      .get(pollHandler.getPolls)
      .post(isLoggedIn, pollHandler.createPoll);

  app.route('/polls/:id')
      .get(function (req, res) {
        console.log(`called for ${req.params.id}`,req.accepts(['text/html', 'application/json', 'json']));
        res.format({
          'text/html': function() {
            res.sendFile(path + '/public/poll.html');
          },
          'application/json': function() {
            pollHandler.getSinglePoll(req, res);
          },
          default: function() {
            res.sendFile(path + '/public/poll.html');
          }
        });
      })
      .post(isLoggedIn, pollHandler.updatePoll)
      .delete(isLoggedIn, pollHandler.deletePoll);
  app.route('/polls/:id/options/:oid')
      .post(pollHandler.vote);

};
