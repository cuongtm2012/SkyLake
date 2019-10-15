var config = require('../config/config');
var axios = require('axios');

module.exports = class fpt {
  constructor() {
    console.log('constructor fpt sms');
  }
  getToken(grantType, clientId, clientSecret, scope, sessionId, onError, onSuccess) {
    var body = {
      "grant_type": grantType,
      "client_id": clientId,
      "client_secret": clientSecret,
      "scope": "send_brandname_otp",
      "session_id": "abcde"
    };
    axios.post(config.URL_TOKEN, body)
      .then(function (response) {
        console.log(response);
        onSuccess(response);
      })
      .catch(function (error) {
        console.log(error);
        onError(error);
      });
  }

  sendSMS(accessToken, phone, message, onError, onSuccess) {
    console.log('00000000000');
    
    var body = {
      "access_token": accessToken,
      "session_id": "abcde",
      "BrandName": config.BRAND_NAME,
      "Phone": phone,
      "Message": message
    };
    axios.post(config.URL_SEND_SMS, body)
      .then(function (response) {
        console.log(response);
        onSuccess(response);
      })
      .catch(function (error) {
        console.log(error);
        onError(error);
      });
  }
};
