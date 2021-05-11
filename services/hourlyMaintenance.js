const covidCLient = require('./covidClient');
const CasesData = require('../models/casesData');
const VaccinesData = require('../models/vaccinesData');
const { json } = require('express');

var hourlyMaintenance = {
	run: async function(){
		const casesJsonResult = await covidCLient.getAllCasesData();
		const vaccinesJsonResult = await covidCLient.getAllVaccinesData();

		this._saveCasesData(casesJsonResult);
		this._saveVaccinesData(vaccinesJsonResult);
	},

	_saveCasesData: function(jsonResult){
		//Remove the "Global" object from the json response from the Covid API as it follows a different format. 
		delete jsonResult['Global'];

		for(obj in jsonResult){
			try{
				const newCasesData = this._casesDataFromJsonResult(jsonResult[obj]);

				CasesData.findOne({countryName: newCasesData.countryName, updated: newCasesData.updated}, function(err, oldCasesData){
					if(!oldCasesData){
						newCasesData.save();
					}
				});
			}
			catch(err){
				console.log(`Cases import for ${obj} failed: ${err.message}`);
			}
		}
	},

	_saveVaccinesData: function(jsonResult){
		for(obj in jsonResult){
			if(jsonResult[obj]['All'].country !== undefined){
				try{
					const newVaccinesData = this._vaccinesDataFromJsonResult(jsonResult[obj]);
					
					VaccinesData.findOne({countryName: newVaccinesData.countryName, updated: newVaccinesData.updated}, function( err, oldVaccinesData){
						if(!oldVaccinesData){
							newVaccinesData.save();
						}
					});
				}
				catch(err){
					console.log(`Vaccines import for ${obj} failed: ${err.message}`);
				}
			}
		}
	},

	_casesDataFromJsonResult: function(casesData){
		return new CasesData({
			countryName: casesData['All'].country,
			countryCode: casesData['All'].abbreviation,
			confirmed: casesData['All'].confirmed,
			recovered: casesData['All'].recovered,
			deaths: casesData['All'].deaths,
			updated: casesData['All'].updated ? casesData['All'].updated : casesData[Object.keys(casesData)[1]].updated
		});
	},

	_vaccinesDataFromJsonResult: function(vaccinesData){
		return new VaccinesData({
			countryName: vaccinesData['All'].country,
			countryCode: vaccinesData['All'].abbreviation,
			population: vaccinesData['All'].population,
			administered: vaccinesData['All'].administered,
			peopleVaccinated: vaccinesData['All'].people_vaccinated,
			peoplePartiallyVaccinated: vaccinesData['All'].people_partially_vaccinated,
			updated: vaccinesData['All'].updated,
		});
	}
}

module.exports = hourlyMaintenance;


