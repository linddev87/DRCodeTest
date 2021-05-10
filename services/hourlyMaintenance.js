const dbClient = require('./dbClient');
const covidCLient = require('./covidClient');
const CountryCases = require('../models/countryCases');

var hourlyMaintenance = {
	run: async function(){
		const casesJsonResult = await covidCLient.getAllCountryCases();

		this._setCountryCases(casesJsonResult);
	},

	_setCountryCases: function(jsonResult){
		//Remove the "Global" object from the json response from the Covid API as it follows a different format. 
		delete jsonResult['Global'];

		for(obj in jsonResult){
			try{
				const newCountryCases = this._countryCasesFromJson(jsonResult[obj]);

				CountryCases.findOne({countryName: newCountryCases.countryName, updated: newCountryCases.updated}, function(err, oldCountryCases){
					if(err){
						console.log(err.message);
					}
	
					if(!oldCountryCases){
						newCountryCases.save();
					}
				});
			}
			catch(err){
				console.log(`${obj} failed: ${err.message}`);
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
	}
}

module.exports = hourlyMaintenance;


