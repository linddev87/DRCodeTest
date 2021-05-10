const mongoose = require('mongoose');

let countryVaccinesSchema = new mongoose.Schema({
    countryName: String,
	countryCode: String,
	administered: String,
    peopleVaccinated: Number,
    peoplePartiallyVaccinated: Number,
	updated: Date
})

const CountryVaccines = mongoose.model('CountryVaccines', countryVaccinesSchema);

module.exports = CountryVaccines;