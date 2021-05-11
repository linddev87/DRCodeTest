const axios = require('axios');

var covidClient = {
	_baseUrl: 'https://covid-api.mmediagroup.fr/v1',

	getAllCasesData: function(){
		return this._getRequest('/cases');
	},

	getAllVaccinesData: function(){
		return this._getRequest('/vaccines');
	},

	_getRequest: async function(endpoint){
		try{
			const response = await axios.get(this._baseUrl + endpoint);
			return response.data;
		}
		catch(error){
			console.log(error.message);
		}
	}
}

module.exports = covidClient;