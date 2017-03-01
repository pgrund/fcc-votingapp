'use strict';

var path = process.cwd();
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
    console.log('check auth', req.isAuthenticated(), req.user);
		if (req.isAuthenticated()) {
      return next();
		} else {
      console.log('not authenticated');
      req.session.returnTo = req.path;
      res.redirect('/login');
		}
	}

  var pollHandler = new PollHandler();

	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
      console.log('user at login',req.user);
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

  app.route('/auth/local')
  		.post(function(req, res, next) {
          console.log('auth local hit', req.user, req.body.username, req.body.password);
          next();
        },
        function(req, res, next) {
          passport.authenticate('local', {
              failureRedirect: '/login',
              successReturnToOrRedirect : (req.session.returnTo ? req.session.returnTo : '/')
            })(req, res, next);
          }
        );


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
