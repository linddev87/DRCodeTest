const mongoose = require('mongoose');

var dbClient = {
	saveToDb: function(document){
		document.save();
	},

	_execute: function(func){
		mongoose.connect('mongodb://localhost/codetest');
		const db = mongoose.connection;

		db.on('error', console.error.bind(console, 'Connection error: '));
		db.once('open', func);
	},

}
module.exports = dbClient;