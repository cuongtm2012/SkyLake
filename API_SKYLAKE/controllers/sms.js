var fptsms = require('../app').fptsms;
var config = require('../config/config');
var axios = require('axios');

module.exports = class smsDb {
  // Cron job notification
  cron(db, onComplete) {
    var fpt_token = '';
    var body = {
      "grant_type": config.TOKEN.GRANT_TYPE,
      "client_id": config.TOKEN.CLIENT_ID,
      "client_secret": config.TOKEN.CLIENT_SECRET,
      "scope": config.TOKEN.SCOPE,
      "session_id": config.TOKEN.SESSION_ID
    };
    axios.post(config.TOKEN.URL, body)
      .then(function (response) {
        console.log('---------GET TOKEN------------');
        fpt_token = response.data.access_token;
        console.log(fpt_token);
        db.query('SELECT MSGKEY, COMPKEY, ID, PHONE, CALLBACK, STATUS, WRTDATE, REQDATE, RSLTDATE, REPORTDATE, TERMINATEDDATE, EXPIRETIME, RSLT, MSG, `TYPE`, SENDCNT, SENTDATE, TELCOINFO, ETC1, ETC2, ETC3, ETC4 FROM SMS_MSG.SMSMSG WHERE STATUS = 0 OR RSLT != 06 ORDER BY REQDATE', (err, result, fields) => {
          if (err) {
            console.log(err);
            return;
          }
          if (result.length < 1) {
            console.log('Empty value');
            return;
          } else {
            result.forEach(sms => {
              var msgkey = sms.MSGKEY;
              var phone = sms.PHONE;
              var msg = sms.MSG;

              var currentTime = new Date().getTime();
              console.log('-- CURRENT TIME :' + currentTime);
              var requestDate = new Date(sms.REQDATE).getTime();
              console.log('-- REQUEST TIME : ' + requestDate);
              if (currentTime > requestDate) {
                console.log('-- SEND SMS : PHONE [' + phone + '] MESSAGE [' + msg + ']');

                // Send SMS
                var body = {
                  "access_token": fpt_token,
                  "session_id": config.SEND_SMS.SESSION_ID,
                  "BrandName": config.SEND_SMS.BRAND_NAME,
                  "Phone": phone,
                  "Message": Buffer.from(msg).toString('base64')
                };
                axios.post(config.SEND_SMS.URL, body)
                  .then(function (response) {
                    console.log(response.data);
                    var d = new Date();
                    d = new Date(d.getTime() - 3000000);
                    var rsldate = d.getFullYear().toString() + "-" + ((d.getMonth() + 1).toString().length == 2 ? (d.getMonth() + 1).toString() : "0" +
                      (d.getMonth() + 1).toString()) + "-" + (d.getDate().toString().length == 2 ? d.getDate().toString() : "0" +
                      d.getDate().toString()) + " " + (d.getHours().toString().length == 2 ? d.getHours().toString() : "0" +
                      d.getHours().toString()) + ":" + ((parseInt(d.getMinutes() / 5) * 5).toString().length == 2 ? (parseInt(d.getMinutes() / 5) * 5).toString() : "0" +
                      (parseInt(d.getMinutes() / 5) * 5).toString()) + ":00";
                    console.log(rsldate);
                    console.log(msgkey);
                    console.log(phone);

                    // update SMSMSG table
                    db.query('UPDATE SMS_MSG.SMSMSG SET STATUS = 3, RSLT = 06, RSLTDATE = ? WHERE MSGKEY = ? AND PHONE = ?',
                      [rsldate, msgkey, phone], (err, result, fields) => {
                        if (err) {
                          console.log(err);
                          return;
                        }
                        if (result.affectedRows) {
                          console.log('Update Successfully!!!!');
                        }
                      });
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              }
            });
          }
        });
      })
      .catch(function (error) {
        console.log(error);
        onError(error);
      });
  }
}
