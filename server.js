// Imports
const cron = require('node-cron');
const hourlyMaintenance = require('./services/hourlyMaintenance');
const express = require('express');
const controller = require('./api/controllers');

// Set up Mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/codetest',{ useUnifiedTopology: true, useNewUrlParser: true });

// Instantiate constants
const app = express();
const port = 3000;

// Set routes
app.get('/bycountrycode/:countrycode', function(req, res){
	controller.reportByCountryCode(req, res);
})

app.get('/bycountrycode', function(req, res){
	res.send('Yo');
})

// Run database update and schedule hourly run
hourlyMaintenance.run();
cron.schedule('0 * * * *', function(){
	hourlyMaintenance.run();
});

// Start the app
app.listen(port, () => {
	console.log(`App started. Listening on port ${port}`);
})