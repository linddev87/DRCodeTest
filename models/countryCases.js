const mongoose = require('mongoose');

let countryCasesSchema = new mongoose.Schema ({
	countryName: String,
	countryCode: String,
	confirmed: Number,
	recovered: Number,
	deaths: Number,
	updated: Date
});

const CountryCases = mongoose.model('CountryCases', countryCasesSchema);

module.exports = CountryCases;