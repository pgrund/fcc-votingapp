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
			// res.sendFile(path + '/public/index.html');
      var filter;
      if(req.isAuthenticated() && req.query.filter != undefined) {
        console.log('filtering for user', req.user);
        filter=req.user.id;
      }
      pollHandler.getAllPolls(filter)
        .then( result => {
          res.render('home', { polls: result});
        });
		});

	app.route('/login')
		.get(function (req, res) {
      res.render('login');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	app.route('/profile')
		.get(
      isLoggedIn,
      (req, res)  => {
        res.render('profile');
  		});

  app.route('/auth/local')
      .post(function(req, res, next) {
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
      .get(pollHandler.getSinglePoll)
      .post(isLoggedIn, pollHandler.updatePoll)
      .delete(isLoggedIn, pollHandler.deletePoll);

  app.route('/polls/:id/options/:oid')
      .post(pollHandler.vote);

};
