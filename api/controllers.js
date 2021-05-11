'use strict';

const countryReport = require('../models/CountryReport');

let controllers = {
	reportByCountryCode: async function(req, res){
		const report = await countryReport.getByCountryCode(req.params.countryCode);
		console.log(report);
		if(!report){
			res.send('Failed to get country report');
		}
		res.send(report);
	}
}

module.exports = controllers;