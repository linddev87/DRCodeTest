const CountryReport = require('./countryReport');

let fatalityReport = {
    _countryReports: [],

    getTopCountries: async function(query){
        const reports = await this._getCountryReports();
        const topCountries = [];

        for(let i = 0; i < query.top; i++){
            const entry = this._getCountryFatalityEntry(reports[i]);

            topCountries.push(entry);
        }

        return topCountries;
    },

    updateReports: async function(){
        const reports = await CountryReport.listAll();
        const sortedReports = reports.sort((a, b) => (a.fatalityRate > b.fatalityRate) ? -1 : 1);

        this._countryReports = sortedReports;
    },

    _getCountryReports: async function (){
        if(this._countryReports.length == 0){
            await this.updateReports();
        }

        return this._countryReports;
    },

    _getCountryFatalityEntry: function(countryData){
        return {
            country: countryData.countryName,
            fatalityRate: countryData.fatalityRate
        }
    }
}

module.exports = fatalityReport;