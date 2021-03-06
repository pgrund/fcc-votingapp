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
      res.redirect(302, '/login');
		}
	}

  var pollHandler = new PollHandler();

	app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	});
	app.route('/')
		.get(function (req, res) {
			
			 res.sendFile(path + '/app/public/index.html');
		});


	app.route('/logout')
		.get(function (req, res) {
      console.log('logged out');
			req.logout();
      req.session.destroy();
			res.redirect('/');
		});

	app.route('/profile')
		.get(isLoggedIn,(req, res)  => {
        res.render('profile');
  		});

  app.route('/auth/local')
    	.post(
    		passport.authenticate('local', {
               failureRedirect: '/login',
              //  successReturnToOrRedirect : (req.session.returnTo ? req.session.returnTo : '/')
            }), 
            function(req, res, next) {
              req.session.user = req.user;
              res.json(req.user);
            }
         );


	app.route('/auth/github')
		.get(
			passport.authenticate('github')
		);

	app.route('/auth/github/callback')
		.get(
			passport.authenticate('github', {
				//successRedirect: '/',
				failureRedirect: '/login'
			}),
			function(req,res) {
				console.log('github auth done, register user', req.user);
				req.session.user = req.user;
	            res.redirect('/');
			}
		);
   app.delete('/auth', function(req, res) {
        req.logout();
        res.writeHead(200);
        res.end();
    });

	app.route('/polls')
      .get(function(req, res){
        pollHandler.getAllPolls().then( function(result) {
            var user = req.user ? req.user : {
              id: req.ip.replace(/\.|\s|:|\\|\//g, '_'),
              username: `user-${req.ip}`,
              displayName: `anonymous from ${req.ip}`
            };
            res.json({ polls: result, user: user});
          });
        })
      .post(isLoggedIn, pollHandler.createPoll);

  app.route('/polls/:id')
      .get(function(req,res) {
				pollHandler.getSinglePoll(req, res).then( function(result) {
					var user = req.user ? req.user : {
						id: req.ip.replace(/\.|\s|:|\\|\//g, '_'),
						username: `user-${req.ip}`,
						displayName: `anonymous from ${req.ip}`
					};
					res.json({ polls: result, user: user});
				});
			})
      .post(isLoggedIn, pollHandler.updatePoll)
      .delete(isLoggedIn, pollHandler.deletePoll);

	app.route('/polls/:id/options')
		      .post(function(req,res,next) {
		          console.log('adding option', req.params.id, req.body);
		          next();
		        },pollHandler.addOption);

  app.route('/polls/:id/options/:oid')
      .post(function(req,res,next) {
          console.log('voting', req.user);
          next();
        },pollHandler.vote);

};
