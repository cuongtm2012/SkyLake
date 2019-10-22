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
		CLIENT_ID: 'A07d0C00625988D7FAd9b9c8D684bef94Acf8a82',
		CLIENT_SECRET: 'c5a3e767Ea06cdf73bcf303C64acae4f52a2f9ed1e130bF567f5663ae4A1dc9265af2D02',
		SCOPE_BRANDNAME_OTP: 'send_brandname_otp',
		SCOPE_BRANDNAME : 'send_brandname',
		SESSION_ID: 'abcde'
	},
	SEND_SMS : {
		URL: 'http://app.sms.fpt.net/api/push-brandname-otp',
		SESSION_ID: 'abcde',
		BRAND_NAME: 'FTI'
	},
	SEND_CREATE_CAMPAIN : {
		URL: 'http://app.sms.fpt.net/api/create-campaign',
		SESSION_ID: 'abcde',
		BRAND_NAME: 'FTI',
		CAMPAIN_NAME: 'QC_SKYLAKE',
		QUOTA: 1
	},
	SEND_SMS_QC : {
		URL: 'http://app.sms.fpt.net/api/push-brandname-ads',
		SESSION_ID: 'abcde',
		BRAND_NAME: 'FTI'
	}
};

module.exports = config;