'use strict';

var Polls = require('../models/polls.js');

function errorHandling(err, res) {
  console.error(err);
  throw err;
}
function PollHandler () {

	this.getPolls = function (req, res) {
    // all polls
    console.log('all polls ...');
		Polls
			.find({})
      .limit(50)
      .sort('-poll.created')
      .select('poll.description')
      .catch(errorHandling)
      .then(result =>  {
        res.json(result);
			});
	};

  this.getSinglePoll = function (req, res) {
    // all polls
    console.log('single poll ...');
		Polls
			.find({_id: req.params.id})
      .select('poll votes')
      .catch(errorHandling)
      .then(result =>  {
        res.json(result);
			});
	};

	this.vote = function (req, res) {
    var p_id = req.params.id,
        o_id = req.params.oid;
    var voter = req.user ? req.user.username : req.ip;
    console.log('vote', voter, p_id, o_id);
		Polls
			.findById(p_id)
      .catch(errorHandling)
      .then(result => {
          var option = result.poll.options.id(o_id);
          if(option == undefined) {
            res.status(400).send(`undefined option ${o_id}`);
            return;
          }
          if(result.votes.some(v => v.user == voter)) {
            console.log('already voted', voter);
            res.status(400).send(`${voter} already voted on ${p_id}`);
            return;
          }
          var vote = {
            user: voter,
            option: o_id
          };
          console.log('found!', vote, result);
          result.votes.push(vote);
          result.markModified('voter');
          result.save()
            .catch(errorHandling)
            .then( (result) => {
              res.json(result);
            });
				}
			);
	};

	this.createPoll = function (req, res) {
		console.log('create a new poll', req.body);
    var poll = new Polls({
      owner: req.user,
      poll: req.body,
      voter: []
    });
    poll.save()
      .catch(errorHandling)
      .then( (result) => {
        console.log('saved!!', result);
        res.json(poll);
      });
	};

  this.updatePoll = function (req, res) {
    var p_id = req.params.id;
    console.log('update poll', req.body);
    Polls.findOneAndUpdate({_id: p_id }, { poll: req.body})
      .catch(errorHandling)
      .then( result => {
        console.log('updated succeeded', result);
        res.sendStatus(200);
      });
	};

  this.deletePoll = function (req, res) {
    var p_id = req.params.id;
    console.log('delete poll', p_id);
    Polls.remove({_id: p_id })
      .catch(errorHandling)
      .then( result => {
        console.log('delete succeeded', p_id);
        res.sendStatus(200);
      });
  };

}

module.exports = PollHandler;
