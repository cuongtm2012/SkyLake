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
    CLIENT_ID: '746581b8e25a733dcc20645aa0640E24085012b4',
    CLIENT_SECRET: 'a0fB20e297c2ab67ff6074c9219be6ddb7b96fedE7c1ae5dc1ce307ced1399c5a066f59C',
    SCOPE_BRANDNAME_OTP: 'send_brandname_otp',
    SCOPE_BRANDNAME: 'send_brandname',
    SESSION_ID: 'abcde'
  },
  SEND_SMS: {
    URL: 'http://app.sms.fpt.net/api/push-brandname-otp',
    SESSION_ID: 'abcde',
    BRAND_NAME: 'SKYLAKEGOLF'
  },
  SEND_CREATE_CAMPAIN: {
    URL: 'http://app.sms.fpt.net/api/create-campaign',
    SESSION_ID: 'abcde',
    BRAND_NAME: 'SKYLAKEGOLF',
    CAMPAIN_NAME: 'QC_SKYLAKE',
    QUOTA: 1
  },
  SEND_SMS_QC: {
    URL: 'http://app.sms.fpt.net/api/push-brandname-ads',
    SESSION_ID: 'abcde',
    BRAND_NAME: 'SKYLAKEGOLF'
  }
};

module.exports = config;
