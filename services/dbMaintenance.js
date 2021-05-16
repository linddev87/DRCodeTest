const covidClient = require('./covidClient');
const CountryData = require('../models/countryData');
const LatestContryData = require('../models/latestCountryData');

const dbMaintenance = {
	//Hourly maintenance - responsible for keeping the database up to date
	run: async function(){
		try{
			//Fetch data from the M-Media group covid API
			const casesJsonResult = await covidClient.getAllCasesData();
			const vaccinesJsonResult = await covidClient.getAllVaccinesData();

			//Compile json results into a compiled object
			const dataCollection = await this._initDataCollection(casesJsonResult, vaccinesJsonResult);

			//Run database update
			await this._updateCountryData(dataCollection);

			//Update array of latest CountryData in memory
			await LatestContryData.set();
		}
		catch(err){
			console.log(err.message);
		}

	},

	// Iterate over dataCollection to instantiate new countryData objects. Call _saveOrDiscard for each new countryData.
	_updateCountryData: async function(dataCollection){
		for(let i in dataCollection.casesDataArr){
			const countryInfo = dataCollection.countryDataArr[i];
			const casesData = dataCollection.casesDataArr.find(c => c.countryCode === countryInfo.countryCode);
			const vaccinesData = dataCollection.vaccinesDataArr.find(v => v.countryCode === countryInfo.countryCode);

			if(countryInfo && casesData && vaccinesData){
				try{
					const countryData = this._newCountryData(countryInfo, casesData, vaccinesData);
					await this._saveOrDiscard(countryData);
				}
				catch(err){
					console.log(err.message);
				}
			}
		}
	},

	// Save country data to DB if the entry is new. Otherwise discard it.
	_saveOrDiscard: async function(newCountryData){
		try{
			const oldCountryData = await CountryData.findOne({countryCode: newCountryData.countryCode}).sort({updated: -1}).limit(1).exec();

			if(oldCountryData === null || oldCountryData.updated < newCountryData.updated){
				newCountryData.save();
			}
		}
		catch(err){
			console.log(err.message);
		}
	},

	// Compile the relevant data from the covid API into an object consisting of 3 arrays
	_initDataCollection: async function(casesJson, vaccinesJson){
		try{
			// The "Global" object in the casesJson response does not comply with the data model for the country-specific objects. We remove it for simplicity.
			delete casesJson.Global;

			let data = {
				countryDataArr: [],
				casesDataArr: [],
				vaccinesDataArr: []
			}

			// casesData and countryData are grabbed from the casesJson response (/cases endpoint).
			for(let i in casesJson){
				data.countryDataArr.push(await this._countryDataFromJsonResult(casesJson[i]));
				data.casesDataArr.push(await this._casesDataFromJsonResult(casesJson[i]));
			}

			// vaccinesData comes from the vaccinesJson response (/vaccines endpoint).
			for(let i in vaccinesJson){
				data.vaccinesDataArr.push(await this._vaccinesDataFromJsonResult(vaccinesJson[i]));
			}
			return data;
		}
		catch(err){
			console.log(err.message);
		}

	},

	// Get the relevant facts about the country from the jsonResponse from json response from the /cases endpoint.
	_countryDataFromJsonResult: async function(casesData) {
		return {
			countryName: casesData['All'].country,
			countryCode: casesData['All'].abbreviation,
			population: casesData['All'].population,
			squareKm: casesData['All'].sq_km_area,
			continent: casesData['All'].continent,
			updated: casesData['All'].updated ? casesData['All'].updated : casesData[Object.keys(casesData)[1]].updated
		};
	},

	// Get the information regarding covid cases from a json response from the /cases endpoint.
	_casesDataFromJsonResult: function(casesData){
		return {
			countryCode: casesData['All'].abbreviation,
			confirmed: casesData['All'].confirmed,
			recovered: casesData['All'].recovered,
			deaths: casesData['All'].deaths
		}
	},

	// Get the information regarding covid cases from a json response from the /cases endpoint.
	_vaccinesDataFromJsonResult: function(vaccinesData){
		return {
			countryCode: vaccinesData['All'].abbreviation,
			population: vaccinesData['All'].population,
			administered: vaccinesData['All'].administered,
			peopleVaccinated: vaccinesData['All'].people_vaccinated,
			peoplePartiallyVaccinated: vaccinesData['All'].people_partially_vaccinated
		};
	},

	// Create a complete CountryData entry from country info, cases and vaccines data.
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

module.exports = dbMaintenance;


