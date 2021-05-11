const CasesData = require('./casesData');
const VaccinesData = require('./casesData');

var countryReport = {
	getByCountryCode: async function(code){
		const casesData = await CasesData.findOne({countryCode: code}).sort({updated: -1}).exec();
		const vaccinesData = await VaccinesData.findOne({countryCode: code}).sort({updated: -1}).exec();

		return this._buildJsonResponse(casesData, vaccinesData);
	},

	_buildJsonResponse(casesData, vaccinesData){
		const countryReport = {
			confirmed: casesData.confirmed,
			recovered: casesData.recovered,
			deaths: casesData.deaths,
			vaccinated: vaccinesData.vaccinated,
			fatalityRate: ( casesData.deaths / casesData.confirmed * 100 ),
			vaccinationCompletionRate: ( vaccinesData.peopleVaccinated / vaccinesData.population * 100)
		}

		return countryReport;
	}
}

module.exports = countryReport;