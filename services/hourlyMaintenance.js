const covidClient = require('./covidClient');
const CountryData = require('../models/countryData');
const FatalityReport = require('../models/fatalityReport');

var hourlyMaintenance = {
	run: async function(){
		const casesJsonResult = await covidClient.getAllCasesData();
		const vaccinesJsonResult = await covidClient.getAllVaccinesData();

		const dataCollection = this._initDataCollection(casesJsonResult, vaccinesJsonResult);
		this._updateCountryData(dataCollection);
	},

	_updateCountryData(inputData){
		for(let i in inputData.casesDataArr){
			const countryInfo = inputData.countryDataArr[i];
			const casesData = inputData.casesDataArr.find(c => c.countryCode === countryInfo.countryCode);
			const vaccinesData = inputData.vaccinesDataArr.find(v => v.countryCode === countryInfo.countryCode);

			if(countryInfo && casesData && vaccinesData){
				try{
					const countryData = this._newCountryData(countryInfo, casesData, vaccinesData);
					countryData.save();
				}
				catch(err){
					console.log(err.message);
				}
			}
		}
	},

	_initDataCollection: function(casesJson, vaccinesJson){

		let data = {
			countryDataArr: [],
			casesDataArr: [],
			vaccinesDataArr: []
		}

		for(let i in casesJson){

			data.countryDataArr.push(this._countryDataFromJsonResult(casesJson[i]));
		}

		for(let i in casesJson){
			data.casesDataArr.push(this._casesDataFromJsonResult(casesJson[i]));
		}

		for(let i in vaccinesJson){
			data.vaccinesDataArr.push(this._vaccinesDataFromJsonResult(vaccinesJson[i]));
		}

		return data;
	},

	_countryDataFromJsonResult(casesData) {
		return {
			countryName: casesData['All'].country,
			countryCode: casesData['All'].abbreviation,
			population: casesData['All'].population,
			squareKm: casesData['All'].sq_km_area,
			continent: casesData['All'].continent,
			updated: Date.now()
		};
	},

	_casesDataFromJsonResult: function(casesData){
		return {
			countryCode: casesData['All'].abbreviation,
			confirmed: casesData['All'].confirmed,
			recovered: casesData['All'].recovered,
			deaths: casesData['All'].deaths
		}
	},

	_vaccinesDataFromJsonResult: function(vaccinesData){
		return {
			countryCode: vaccinesData['All'].abbreviation,
			population: vaccinesData['All'].population,
			administered: vaccinesData['All'].administered,
			peopleVaccinated: vaccinesData['All'].people_vaccinated,
			peoplePartiallyVaccinated: vaccinesData['All'].people_partially_vaccinated
		};
	},

	_newCountryData(country, cases, vaccines) {
		return new CountryData({
			countryName: country.countryName,
			countryCode: country.countryCode,
			population: country.population,
			squareKm: country.squareKm,
			continent: country.continent,
			updated: country.updated,
			cases:{
				confirmed: cases.confirmed,
				recovered: cases.recovered,
				deaths: cases.deaths,
				updated: cases.updated,
				fatalityRate: (cases.deaths / cases.confirmed * 100).toFixed(2)
			},
			vaccines: {
				administered: vaccines.administered,
				peopleVaccinated: vaccines.peopleVaccinated,
				peoplePartiallyVaccinated: vaccines.peoplePartiallyVaccinated,
				vaccinationCompletionRate: vaccines.peopleVaccinated ? (vaccines.peopleVaccinated / country.population * 100).toFixed(2) : 0
			}
		});
	}
}

module.exports = hourlyMaintenance;


