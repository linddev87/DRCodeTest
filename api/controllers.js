'use strict';

const CountryReport = require('../models/CountryReport');

let controllers = {
	reportByCountryCode: function(req, res){
		const report = new CountryReport({countryCode: 'DK', countryName: 'Denmark'});
		report.consoleLog();

		if(!report){
			res.send('Failed to get country report');
		}
		res.send(report);
	}
}

module.exports = controllers;