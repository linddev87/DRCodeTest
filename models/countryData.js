const mongoose = require('mongoose');

let countryDataSchema = new mongoose.Schema({
    countryName: String,
    countryCode: String,
    population: Number,
    squareKm: Number,
    continent: String,
    updated: Date,
    cases: {
        confirmed: Number,
        recovered: Number,
        deaths: Number,
        updated: Date,
        fatalityRate: Number
    },
    vaccines: {
        administered: Number,
        peopleVaccinated: Number,
        peoplePartiallyVaccinated: Number,
        updated: Date,
        vaccinationCompletionRate: Number
    }
});

const CountryData = mongoose.model('CountryData', countryDataSchema);

module.exports = CountryData;