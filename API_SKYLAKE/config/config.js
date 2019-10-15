var config = {
	database: {
		host: '192.168.1.5',
		user: 'skylakecc',
		password: 'skylakeccerp',
		port: 3307,
		database: 'skylakecc_erp'
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