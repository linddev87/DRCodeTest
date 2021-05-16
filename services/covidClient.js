const axios = require('axios');
const config = require('../config.json');

// Simple client to consume m media group api
var covidClient = {
	_baseUrl: config.apiBaseUrl,

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