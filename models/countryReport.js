const LatestCountryData = require('./latestCountryData');

let countryReports = {
	// Fetch latestCountryData from the LatestCountryData module => create publicCountryReports and return them.
	getAllPublicReports: async function(){
		const latestCountryDataArr = await LatestCountryData.get();
		let publicCountryReports = [];

		for(let i in latestCountryDataArr){
			publicCountryReports.push(await this._buildPublicReport(latestCountryDataArr[i]));
		}

		return publicCountryReports;
	},

	// Fetch one countryData from the LatestCountryData module => Convert to public report and return that.
	getPublicReportByCountryCode: async function(code){
		const countryData = await LatestCountryData.findByCountryCode(code);
		return this._buildPublicReport(countryData);

	},

	// Build a public report json response based on the full CountryReport object.
	_buildPublicReport: async function(countryData){
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