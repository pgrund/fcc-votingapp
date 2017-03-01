'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Option = new Schema({
  key: String,
  name: String
});
var Poll = new Schema({
  owner: {
		id: String,
		displayName: String,
		username: String,
    publicRepos: Number
	},
  votes: [{
    user: String,
    option: String
  }],
  poll: {
    description: String,
    created: { type: Date, default: Date.now },
    options: [Option]
  },
});

module.exports = mongoose.model('Poll', Poll);
