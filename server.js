var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
const request = require('request');

/*
    SynapsePay Config and Set Up
 */
const SynapsePay = require('synapsepay');
var synapseConfig = JSON.parse(fs.readFileSync('./config/synapseConfig.json', 'utf8'));
var xSpUserGateway = synapseConfig.clientId + '|' + synapseConfig.clientSecret;
var xSpUserIp = synapseConfig.clientUserIp;
var xSpUser = synapseConfig.clientUser;
var baseUrl = synapseConfig.baseUrl;

/*
	Gets all users associated with synapseClientId and clientSecret; results are paginated with a get query param to specify page length and number
 */

var getAllUsers = function () {
	var options = {
		method: 'GET',
		url: baseUrl +  '/users',
		headers: {
			'X-SP-GATEWAY': xSpUserGateway,
			'X-SP-USER-IP': xSpUserIp,
			'X-SP-USER': xSpUser 
		}
	}

	request(options, function (err, res, body) {
		if (err) {
			console.log(err);
		} else {
			console.log(body);
		}
	});
}

/*
	Gets the information for a specific user including the refresh token; used generally to validate user information and request a new refresh token when the previous one expires
 	Arguments
 		userId: Unique SynapseFi _id field provided by getAllUsers() 
 */

var getUser = function (userId) {
	var url = baseUrl + '/users/' + userId;
	var options = {
		method: 'GET',
		url: url,
		headers: {
			'X-SP-GATEWAY': xSpUserGateway,
			'X-SP-USER-IP': xSpUserIp,
			'X-SP-USER': xSpUser 
		}
	}

	request(options, function (err, res, body) {
		if (err) {
			console.log(err);
		} else {
			console.log(body);
		}
	});
}

/*
	Creates a new user and returns the userId and refresh token; the userId need to be stored
	Arguments
		email: Email to be associated with the SynapseFi account
		phoneNumbers: Array of phone numbers to be associated with the SynapseFi account; phone numbers are strings with . seperating sections i.e. 123.123.1234; country code is not required
		legalNames: Array of legal names; legal names are strings with a space seperating first and last names
 */

var createUsers = function (email, phoneNumbers, legalNames) {
	var options = {
		url: baseUrl + '/users',
		headers: {
			'Content-Type': 'application/json',
			'X-SP-GATEWAY': xSpUserGateway,
			'X-SP-USER-IP': xSpUserIp,
			'X-SP-USER': xSpUser 
		},
		json: {
			logins: [
				{
					email: email
				}
			],
			phone_numbers: phoneNumbers,
			legal_names: legalNames
		}
	}

	request.post(options, function (err, res, body) {
		if (err) {
			console.log(err);
		} else {
			console.log(body);
		}
	});
}

/* 
	Gets the OAuth access token or the OAuth key using the refresh token
	Arguments
		userId: Unique SynapseFi _id field provided by getAllUsers() 
		refreshToken: The OAuth refresh token returned through createUser() or getUser(); refresh tokens expire after 8 days
 */

var getOAuthToken = function (userId, refreshToken) {
	var url = baseUrl + '/oauth/' + userId;
	var options = {
		url: url,
		headers: {
			'Content-Type': 'application/json',
			'X-SP-GATEWAY': xSpUserGateway,
			'X-SP-USER-IP': xSpUserIp,
			'X-SP-USER': xSpUser 
		},
		json: {
			refresh_token: refreshToken
		}
	}

	request.post(options, function (err, res, body) {
		if (err) {
			console.log(err);
		} else {
			console.log(body);
		}
	});
}

/*
	Add document to user account; this call takes several seconds
	Arguments
		userId: Unique SynapseFi _id field provided by getAllUsers() 
		OAuthToken: OAuth access token returned by getOAuthToken(); the access token expires after 8 uses or ~ 30 minutes
		documents: Array of document objects as defined by SynapseFi here: https://docs.synapsepay.com/docs/adding-documents
 */

var addDocument = function (userId, OAuthToken, documents) {
	var url = baseUrl + '/users/' + userId;
	var xSpUserOAuth = OAuthToken + xSpUser;
	var options = {
		url: url,
		headers: {
			'Content-Type': 'application/json',
			'X-SP-GATEWAY': xSpUserGateway,
			'X-SP-USER-IP': xSpUserIp,
			'X-SP-USER': xSpUserOAuth
		},
		json: {
			documents: documents
		}
	}

	request.patch(options, function (err, res, body) {
		if (err) {
			console.log(err);
		} else {
			console.log(body);
		}
	});
}

/*
	Get all nodes/accounts for selected user
	Argument
		userId: Unique SynapseFi _id field provided by getAllUsers() 
		OAuthToken: OAuth access token returned by getOAuthToken(); the access token expires after 8 uses or ~ 30 minutes
 */

var getNodes = function (userId, OAuthToken) {
	var url = baseUrl + '/users/' + userId + '/nodes';
	var xSpUserOAuth = OAuthToken + xSpUser;
	var options = {
		url: url,
		headers: {
			'Content-Type': 'application/json',
			'X-SP-GATEWAY': xSpUserGateway,
			'X-SP-USER-IP': xSpUserIp,
			'X-SP-USER': xSpUserOAuth
		}
	}

	request.get(options, function (err, res, body) {
		if (err) {
			console.log(err);
		} else {
			console.log(body);
		}
	});
}

/*
	Add node to user account
	Argument
		userId: Unique SynapseFi _id field provided by getAllUsers() 
		OAuthToken: OAuth access token returned by getOAuthToken(); the access token expires after 8 uses or ~ 30 minutes
		type: a string that describes the type of account according to different node types listed here: https://docs.synapsepay.com/docs/node-resources
		nickname: a string nickname for the particular node; may be used for reference by other functions
 */

var addNode = function (userId, OAuthToken, type, nickname) {
	var url = baseUrl + '/users/' + userId + '/nodes';
	var xSpUserOAuth = OAuthToken + xSpUser;
	var options = {
		url: url,
		headers: {
			'Content-Type': 'application/json',
			'X-SP-GATEWAY': xSpUserGateway,
			'X-SP-USER-IP': xSpUserIp,
			'X-SP-USER': xSpUserOAuth
		},
		json: {
			type: type,
			info: {
				nickname: nickname
			}
		}
	}

	request.post(options, function (err, res, body) {
		if (err) {
			console.log(err);
		} else {
			console.log(body);
		}
	});
}

/*
	Adds a bank node; this is used to link an existing bank account from an accredited institution to the synapse account; this function hits the same endpoint as the regular addNode() but includes bankName, bankId, and bankPassword as arguments
	Arguments
		userId: Unique SynapseFi _id field provided by getAllUsers() 
		OAuthToken: OAuth access token returned by getOAuthToken(); the access token expires after 8 uses or ~ 30 minutes
		bankId: Username associated with the bank account to be linked
		bankPassword: Password associated with the bank account to be linked
		bankName: Name of the banking institution as defined here: https://uat-api.synapsefi.com/v3/institutions/show
 */

var addAchNode = function (userId, OAuthToken, bankId, bankPassword, bankName) {
	var url = baseUrl + '/users/' + userId + '/nodes';
	var xSpUserOAuth = OAuthToken + xSpUser;
	var options = {
		url: url,
		headers: {
			'Content-Type': 'application/json',
			'X-SP-GATEWAY': xSpUserGateway,
			'X-SP-USER-IP': xSpUserIp,
			'X-SP-USER': xSpUserOAuth
		},
		json: {
			type: 'ACH-US',
			info: {
				bank_id: bankId,
				bank_pw: bankPassword,
				bank_name: bankName
			}
		}
	}

	request.post(options, function (err, res, body) {
		if (err) {
			console.log(err);
		} else {
			console.log(body);
		}
	});
}

/*
	Gets the subnet associated with the node; subnets are virtual account and routing numbers that can be attached to a SynapseFi account
	Arguments
		userId: Unique SynapseFi _id field provided by getAllUsers() 
		OAuthToken: OAuth access token returned by getOAuthToken(); the access token expires after 8 uses or ~ 30 minutes
		nodeId: The uniqueId of the node; can be obtained using the getNodes() function
 */

var getSubnet = function (userId, OAuthToken, nodeId) {
	var url = baseUrl + '/users/' + userId + '/nodes/' + nodeId + '/subnets';
	var xSpUserOAuth = OAuthToken + xSpUser;
	var options = {
		url: url,
		headers: {
			'Content-Type': 'application/json',
			'X-SP-GATEWAY': xSpUserGateway,
			'X-SP-USER-IP': xSpUserIp,
			'X-SP-USER': xSpUserOAuth
		}
	}

	request.get(options, function (err, res, body) {
		if (err) {
			console.log(err);
		} else {
			console.log(body);
		}
	});
}

/*
	Adds a subnet to an exhisting node; adds a virtual account and routing number to a node
	Argument
		userId: Unique SynapseFi _id field provided by getAllUsers() 
		OAuthToken: OAuth access token returned by getOAuthToken(); the access token expires after 8 uses or ~ 30 minutes
		nodeId: The uniqueId of the node; can be obtained using the getNodes() function
		nickname: Nickname for the subnet
 */

var addSubnet = function (userId, OAuthToken, nodeId, nickname) {
	var url = baseUrl + '/users/' + userId + '/nodes/' + nodeId + '/subnets';
	var xSpUserOAuth = OAuthToken + xSpUser;
	var options = {
		url: url,
		headers: {
			'Content-Type': 'application/json',
			'X-SP-GATEWAY': xSpUserGateway,
			'X-SP-USER-IP': xSpUserIp,
			'X-SP-USER': xSpUserOAuth
		},
		json: {
			nickname: nickname
		}
	}

	request.post(options, function (err, res, body) {
		if (err) {
			console.log(err);
		} else {
			console.log(body);
		}
	});
}

var app = express();
var port = 8080;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());

app.post('/test', function (req, res) {
	//var postParam = req.body.postParam;
	// var req.get("custom-header-name");
	res.sendStatus(200);
});

app.post('/createUser', function (req, res) {

});

app.post('/login', function (req, res) {

});

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, function () {
	console.log('Server running on port ' + port + '.');
});