var config = {
	database: {
		host: '1.55.215.214',
		user: 'root',
		password: 'infocity12!@',
		port: 3969,
		database: 'SMS_MSG'
	},
	TOKEN: {
		URL: 'http://app.sms.fpt.net/oauth2/token',
		GRANT_TYPE: 'client_credentials',
		CLIENT_ID: 'd00b35133DF985eB4ed89b683057192E6fc7b757',
		CLIENT_SECRET: '3284b063ec0e07efa38bc9b50fec18470Ccc41a79E3C2588F5b37d12f545dbdd5ae91e81',
		SCOPE: 'send_brandname_otp',
		SESSION_ID: 'abcde'
	},
	SEND_SMS : {
		URL: 'http://app.sms.fpt.net/api/push-brandname-otp',
		SESSION_ID: 'abcde',
		BRAND_NAME: 'FTI'
	}
};

module.exports = config;