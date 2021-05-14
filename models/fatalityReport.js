const CountryData = require('./countryData');

let fatalityReport = {
    _countryDataArr: [],

    getTopCountries: async function(query){
        const reports = await this._getCountryReports();
        const filteredReports = reports.slice(0, query.amount);
        let response = [];

        for(let i in filteredReports){
            response.push(this._getCountryFatalityEntry(filteredReports[i]));
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
        let countryDataArr = [];

        for(let i in countryCodes){
            const countryData = await CountryData.findOne({countryCode: countryCodes[i]}).sort({updated: -1}).limit(1).exec();
            countryDataArr.push(countryData);
        }

        this._countryDataArr = countryDataArr.sort((a, b) => (a.cases.fatalityRate > b.cases.fatalityRate) ? -1 : 1);
    },

    _getCountryFatalityEntry: function(countryData){

        console.log(countryData);
        return {
            country: countryData.countryName,
            fatalityRate: countryData.cases.fatalityRate
        }
    }
}

module.exports = fatalityReport;