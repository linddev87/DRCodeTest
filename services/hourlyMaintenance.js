const covidCLient = require('./covidClient');
const CountryCases = require('../models/countryCases');
const CountryVaccines = require('../models/countryVaccines');
const { json } = require('express');

var hourlyMaintenance = {
	run: async function(){
		const casesJsonResult = await covidCLient.getAllCountryCases();
		const vaccinesJsonResult = await covidCLient.getAllCountryVaccines();

		this._saveCountryCases(casesJsonResult);
		this._saveCountryVaccines(vaccinesJsonResult);
	},

	_saveCountryCases: function(jsonResult){
		//Remove the "Global" object from the json response from the Covid API as it follows a different format. 
		delete jsonResult['Global'];

		for(obj in jsonResult){
			try{
				const newCountryCases = this._countryCasesFromJson(jsonResult[obj]);

				CountryCases.findOne({countryName: newCountryCases.countryName, updated: newCountryCases.updated}, function(err, oldCountryCases){
					if(!oldCountryCases){
						newCountryCases.save();
					}
				});
			}
			catch(err){
				console.log(`Cases import for ${obj} failed: ${err.message}`);
			}
		}
	},

	_saveCountryVaccines: function(jsonResult){
		for(obj in jsonResult){
			if(jsonResult[obj]['All'].country !== undefined){
				try{
					const newCountryVaccines = this._countryVaccinesFromJson(jsonResult[obj]);
					
					CountryVaccines.findOne({countryName: newCountryVaccines.countryName, updated: newCountryVaccines.updated}, function( err, oldCountryVaccines){
						if(!oldCountryVaccines){
							newCountryVaccines.save();
						}
					});
				}
				catch(err){
					console.log(`Vaccines import for ${obj} failed: ${err.message}`);
				}
			}
			
		}
	},

	_countryCasesFromJson: function(countryData){
		return new CountryCases({
			countryName: countryData['All'].country,
			countryCode: countryData['All'].abbreviation,
			confirmed: countryData['All'].confirmed,
			recovered: countryData['All'].recovered,
			deaths: countryData['All'].deaths,
			updated: countryData['All'].updated ? countryData['All'].updated : countryData[Object.keys(countryData)[1]].updated
		});
	},

	_countryVaccinesFromJson: function(countryData){
		return new CountryVaccines({
			countryName: countryData['All'].country,
			countryCode: countryData['All'].abbreviation,
			administered: countryData['All'].administered,
			peopleVaccinated: countryData['All'].people_vaccinated,
			peoplePartiallyVaccinated: countryData['All'].people_partially_vaccinated,
			updated: countryData['All'].updated,
		});
	}
}

module.exports = hourlyMaintenance;


