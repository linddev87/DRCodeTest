const mongoose = require('mongoose');

let casesDataSchema = new mongoose.Schema ({
	countryName: String,
	countryCode: String,
	confirmed: Number,
	recovered: Number,
	deaths: Number,
	updated: Date
});

const CasesData = mongoose.model('CasesData', casesDataSchema);

module.exports = CasesData;