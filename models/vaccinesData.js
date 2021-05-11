const mongoose = require('mongoose');

let vaccinesDataSchema = new mongoose.Schema({
    countryName: String,
	countryCode: String,
    population: Number,
	administered: Number,
    peopleVaccinated: Number,
    peoplePartiallyVaccinated: Number,
	updated: Date
})

const VaccinesData = mongoose.model('VaccinesData', vaccinesDataSchema);

module.exports = VaccinesData;