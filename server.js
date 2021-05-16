// Imports
const cron = require('node-cron');
const hourlyDbMaintenance = require('./services/hourlyDbMaintenance');
const express = require('express');
const controller = require('./api/controllers');

// Set up Mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/codetest',{ useUnifiedTopology: true, useNewUrlParser: true });

// Instantiate constants
const app = express();
const port = 3000;

// Set routes
app.get('/countryreport/:countryCode/bycountrycode', function(req, res){
	controller.reportByCountryCode(req, res);
})

app.get('/countryreport', function(req, res){
	controller.reportList(req, res);
})

app.get('/fatalityReport', function(req,res){
	controller.fatalityReport(req,res);
})

// Run database update and schedule hourly run
hourlyDbMaintenance.run();
cron.schedule('0 * * * *', function(){
	hourlyDbMaintenance.run();
});

// Start the app
app.listen(port, () => {
	console.log(`App started. Listening on port ${port}`);
})