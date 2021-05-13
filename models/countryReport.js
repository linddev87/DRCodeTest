const CasesData = require('./casesData');
const VaccinesData = require('./vaccinesData');

let countryReport = {
	listAll: async function(){
		const countryReports = [];
		const countryCodes = await CasesData.distinct("countryCode").exec()
			.catch(function(err) {
				console.log(err.message);
			});

		for(let i in countryCodes){
			const report = await this.getByCountryCode(countryCodes[i]);

			if(report){
				countryReports.push(report);
			}
		}

		return countryReports;
	},

	getByCountryCode: async function(code){
		const casesData = await CasesData.findOne({countryCode: code}).sort({updated: -1}).exec()
			.catch(function(err){
				console.log(err.message);
			});

		const vaccinesData = await VaccinesData.findOne({countryCode: code}).sort({updated: -1}).exec()
			.catch(function(err){
				console.log(err.message);
			});

		if(casesData && vaccinesData){
			return this._buildJsonResponse(casesData, vaccinesData);
		}
		else {
			return null;
		}
	},

	_buildJsonResponse(casesData, vaccinesData){
		return {
			countryName: casesData.countryName,
			countryCode: casesData.countryCode,
			confirmed: casesData.confirmed,
			recovered: casesData.recovered,
			deaths: casesData.deaths,
			vaccinated: vaccinesData.peopleVaccinated,
			fatalityRate: (casesData.deaths / casesData.confirmed * 100).toFixed(2),
			vaccinationCompletionRate: (vaccinesData.peopleVaccinated / vaccinesData.population * 100).toFixed(2)
		};
	}
}

module.exports = countryReport;