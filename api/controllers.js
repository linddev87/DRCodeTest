'use strict';

const countryReport = require('../models/countryReport');
const fatalityReport = require('../models/fatalityReport');

let controllers = {
	reportByCountryCode: async function(req, res){
		const report = await countryReport.getByCountryCode(req.params.countryCode.toUpperCase())
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

	reportList: async function(req, res) {
		const reports = await countryReport.listAll()
			.catch(function (err) {
				console.log(err.message);
			});

		res.send(reports);
	},

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
