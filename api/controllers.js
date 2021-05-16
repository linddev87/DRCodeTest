'use strict';

const countryReport = require('../models/countryReport');
const fatalityReport = require('../models/fatalityReport');

let controllers = {
	// Get public report for specific country by countrycode
	reportByCountryCode: async function(req, res){
		const report = await countryReport.getPublicReportByCountryCode(req.params.countryCode.toUpperCase())
			.catch(function(err){
				console.log(err.message);
			});

		if(!report){
			let err = {
				message: `Could not create countryReport for '${req.params.countryCode}'.`
			};

			res.status(400).send(err);
		}

		res.send(report);
	},

	// Get list of all public country reports
	reportList: async function(req, res) {
		const reports = await countryReport.getAllPublicReports()
			.catch(function (err) {
				console.log(err.message);
			});

		if(!reports){
			let err = {
				message: `Could not create report list.`
			};

			res.status(400).send(err);
		}
		res.send(reports);
	},

	// Get fatality report. Supports queries for 'top', 'continent', 'minSize', 'maxSize'
	fatalityReport: async function(req, res){
		const reportList = await fatalityReport.getTopCountries(req.query)
			.catch(function(err){
				console.log(err.message);
			});

		if(!reportList){
			let err = {
				message: `Could not get reportList.`
			};

			res.status(400).send(err);
		}

		res.send(reportList);
	}
}

module.exports = controllers;
