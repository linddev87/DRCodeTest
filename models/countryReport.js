const CountryData = require('./countryData');

let countryReports = {
	_publicCountryReports: [],

	listAll: async function(){
		return this._getAllPublicReports();
	},

	getByCountryCode: async function(code){
		const countryReport = await CountryData.find({countryCode: code}).sort({updated: -1}).limit(1).exec();

    	return this._buildPublicReport(countryReport[0]);
	},

	_getAllPublicReports: async function() {
		if(this._publicCountryReports.length == 0){
			await this._updateCountryReports();
			return this._publicCountryReports;
		}

		return this._publicCountryReports;
	},

	_updateCountryReports: async function(){
		let countryReports = [];
		const countryCodes = await CountryData.distinct("countryCode").exec()
			.catch(function(err) {
				console.log(err.message);
			});

		for(let i in countryCodes){
			const report = await CountryData.findOne({countryCode: countryCodes[i]}).exec();
			if(report){
				const publicReport = this._buildPublicReport(report);
				countryReports.push(publicReport);
			}
		}

		this._publicCountryReports = countryReports.sort((a, b) => (a.country > b.country) ? -1 : 1);
	},

	_buildPublicReport(countryData){
		return {
			countryCode: countryData.countryCode,
			data: {
				confirmed: countryData.cases.confirmed,
				recovered: countryData.cases.recovered,
				deaths: countryData.cases.deaths,
				vaccinated: countryData.vaccines.peopleVaccinated,
				fatalityRate: countryData.cases.fatalityRate,
				vaccinationCompletionRate: countryData.vaccines.vaccinationCompletionRate
			}
		};
	},
}

module.exports = countryReports;