const CountryData = require('./countryData');

// This module serves one purpose: To keep latest countryData entry from MongoDB in memory and serve the data from there.
// This is purely for performance reasons since the mongoose queries can take a while when the database grows.
let latestCountryData = {
    // _countryDataArr holds the array of countryData objects.
    _countryDataArr: [],

    // if the _countryDataArr is set, return it. Otherwise initiate it.
    get: async function(){
        if(this._countryDataArr.length === 0){
            await this.set();
        }

        return this._countryDataArr;
    },

    // Get the latest countryData entry from the database and commit it to memory in the _countryDataArr array
    set: async function(){
        try{
            // Find distinct countryCodes
            const countryCodes = await CountryData.distinct("countryCode").exec();

            // create and populate countryDataArr
            let countryDataArr = [];
            for(let i in countryCodes) {
                const countryData = await CountryData.findOne({countryCode: countryCodes[i]}).sort({updated: -1}).exec();
                countryDataArr.push(countryData);
            }

            this._countryDataArr = countryDataArr;
        }
        catch(err){
            console.log(err.message);
        }

    },

    // Get the latest countryData for a specific countryCode
    findByCountryCode: async function(code) {
        const countryDataArr = await this.get();
        return countryDataArr.find(c => c.countryCode === code);
    }
}

module.exports = latestCountryData;