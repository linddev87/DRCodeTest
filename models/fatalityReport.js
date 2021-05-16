const CountryData = require('./countryData');

let fatalityReport = {
    _countryDataArr: [],

    getTopCountries: async function(query){

        const reports = await this._getCountryReports();

        const filteredReports = reports.slice(0, query.amount);
        let response = [];

        for(let i in filteredReports){
            response.push(await this._getCountryFatalityEntry(filteredReports[i]));
        }

        return response;

    },

    _getCountryReports: async function(){
        if(this._countryDataArr.length > 0){
            return this._countryDataArr;
        }
        else {
            await this._setCountryReports();
            return this._countryDataArr;
        }
    },

    _setCountryReports: async function (){
        const countryCodes = await CountryData.distinct("countryCode").exec();
        const allCountryData = await CountryData.find().sort({updated: -1}).exec();

        let countryDataArr = [];

        for(let i in countryCodes){
            const countryData = allCountryData.find(c => c.countryCode === countryCodes[i]);

            countryDataArr.push(countryData);
        }

        this._countryDataArr = countryDataArr.sort((a, b) => (a.cases.fatalityRate > b.cases.fatalityRate) ? -1 : 1);
    },

    _getCountryFatalityEntry: async function(countryData){

        return {
            country: countryData.countryName,
            fatalityRate: countryData.cases.fatalityRate
        }
    }
}

module.exports = fatalityReport;