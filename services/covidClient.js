const axios = require('axios');

var covidClient = {
	_baseUrl: 'https://covid-api.mmediagroup.fr/v1',

	getAllCountryCases: async function(){
		try{
			const response = await axios.get(this._baseUrl + '/cases');
			return response.data;
		}
		catch(error){
			console.log(error.message);
		}
	}
}

module.exports = covidClient;