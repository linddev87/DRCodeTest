const LatestCountryData = require('./latestCountryData');

let fatalityReport = {
    // Get all countryData, apply filters and instantiate and return fatality report
    getTopCountries: async function(query){
        const countryDataArr = await LatestCountryData.get();
        const sortedDataArr = countryDataArr.sort((a,b) => (a.cases.fatalityRate > b.cases.fatalityRate) ? -1 : 1);
        const filteredDataArr = await this._setFilters(sortedDataArr, query);
        let response = [];

        for(let i in filteredDataArr){
            response.push(await this._getCountryFatalityEntry(filteredDataArr[i]));
        }

        return response;
    },

    // Create a fatality list entry based on a countryData object
    _getCountryFatalityEntry: async function(countryData){
        return {
            country: countryData.countryName,
            fatalityRate: countryData.cases.fatalityRate
        }
    },

    // apply filters to the dataArr based on the query string from the http get request
    _setFilters: async function(dataArr, query) {
        if(query.continent){
            dataArr = dataArr.filter(c => c.continent.toLowerCase() === query.continent.toLowerCase());
        }

        if(query.minSize){
            dataArr = dataArr.filter(c => c.squareKm >= query.minSize);
        }

        if(query.maxSize){
            dataArr = dataArr.filter(c => c.squareKm <= query.maxSize);
        }

        if(query.top){
            dataArr = dataArr.slice(0, query.top);
        }

        return dataArr;
    }
}

module.exports = fatalityReport;