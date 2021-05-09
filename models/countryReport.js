const mongoose = require('mongoose');

let countryReportSchema = new mongoose.Schema ({
	countryCode: String,
	countryName: String
});

countryReportSchema.methods.consoleLog = function(){
	const report = this.countryCode
		? 'Country code: ' + this.countryCode + ', CountryName: ' + this.countryName
		: 'I am empty!'; 

	console.log(report);
}

const CountryReport = mongoose.model('CountryReport', countryReportSchema);

module.exports = CountryReport;