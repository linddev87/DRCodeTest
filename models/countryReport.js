const CasesData = require('./casesData');
const VaccinesData = require('./casesData');

var countryReport = {
	getByCountryCode: async function(code){
		let casesData = await CasesData.findOne({countryCode: code}).sort({updated: -1}).exec();
		let vaccinesData = await VaccinesData.findOne({countryCode: code}).sort({updated: -1}).exec();

		return this._buildJsonResponse(casesData, vaccinesData);
	},

	_buildJsonResponse(casesData, vaccinesData){
		let countryReport = {
			confirmed: casesData.confirmed,
			recovered: casesData.recovered,
			deaths: casesData.deaths,
			vaccinated: vaccinesData.vaccinated,
			fatalityRate: ( casesData.deaths / casesData.confirmed * 100 ).toFixed(2),
			vaccinationCompletionRate: ( vaccinesData.peopleVaccinated / vaccinesData.population * 100).toFixed(2)
		}

		return countryReport;
	}
}

module.exports = countryReport;