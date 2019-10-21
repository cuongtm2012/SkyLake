var config = require('../config/config');
var axios = require('axios');

module.exports = class smsDb {
  // Cron job notification
  cron(db, onComplete) {
    var target = [];
    db.query('SELECT MSGKEY, COMPKEY, ID, PHONE, CALLBACK, STATUS, WRTDATE, REQDATE, RSLTDATE, REPORTDATE, TERMINATEDDATE, EXPIRETIME, RSLT, MSG, `TYPE`, SENDCNT, SENTDATE, TELCOINFO, ETC1, ETC2, ETC3, ETC4 FROM sms_msg WHERE STATUS = 0 OR RSLT != 06 ORDER BY REQDATE', (err, result, fields) => {
      if (err) {
        console.log(err);
        onComplete(0, 0);
        return;
      }
      if (result.length < 1) {
        console.log('Empty value');
        onComplete(0, 0);
        return;
      } else {
        result.forEach(sms => {
          var currentTime = new Date().getTime();
          console.log('-- CURRENT TIME :' + currentTime);
          var requestDate = new Date(sms.REQDATE).getTime();
          console.log('-- REQUEST TIME : ' + requestDate);
          if (currentTime > requestDate) {
            target.push({
              'MSGKEY': sms.MSGKEY,
              'PHONE': sms.PHONE,
              'MSG': sms.MSG
            });
          } else {
            onComplete(0, 0);
          }
        });
      }
      if (target.length > 0) {
        var count = 0;
        var maxlength = target.length;

        var fpt_token = '';
        var body_token = {
          "grant_type": config.TOKEN.GRANT_TYPE,
          "client_id": config.TOKEN.CLIENT_ID,
          "client_secret": config.TOKEN.CLIENT_SECRET,
          "scope": config.TOKEN.SCOPE,
          "session_id": config.TOKEN.SESSION_ID
        };

        axios.post(config.TOKEN.URL, body_token)
          .then(function (response) {
            console.log('---------GET TOKEN------------');
            fpt_token = response.data.access_token;
            console.log(fpt_token);
            target.forEach(sms => {
              var msgkey = sms.MSGKEY;
              var phone = sms.PHONE;
              var msg = sms.MSG;
              console.log('-- SEND SMS : PHONE [' + phone + '] MESSAGE [' + msg + ']');
              // Send SMS
              var body_sms = {
                "access_token": fpt_token,
                "session_id": config.SEND_SMS.SESSION_ID,
                "BrandName": config.SEND_SMS.BRAND_NAME,
                "Phone": phone,
                "Message": Buffer.from(msg).toString('base64')
              };
              axios.post(config.SEND_SMS.URL, body_sms)
                .then(function (response) {
                  count++;
                  var d = new Date();
                  d = new Date(d.getTime() - 3000000);
                  var rsldate = d.getFullYear().toString() + "-" + ((d.getMonth() + 1).toString().length == 2 ? (d.getMonth() + 1).toString() : "0" +
                    (d.getMonth() + 1).toString()) + "-" + (d.getDate().toString().length == 2 ? d.getDate().toString() : "0" +
                    d.getDate().toString()) + " " + (d.getHours().toString().length == 2 ? d.getHours().toString() : "0" +
                    d.getHours().toString()) + ":" + ((parseInt(d.getMinutes() / 5) * 5).toString().length == 2 ? (parseInt(d.getMinutes() / 5) * 5).toString() : "0" +
                    (parseInt(d.getMinutes() / 5) * 5).toString()) + ":00";
                  console.log('Current date : ' + rsldate);
                  var table_monthly = d.getFullYear().toString() + ((d.getMonth() + 1).toString().length == 2 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1).toString());

                  // update SMSMSG table
                  db.query('UPDATE sms_msg SET STATUS = 3, RSLT = 06, RSLTDATE = ? WHERE MSGKEY = ? AND PHONE = ?',
                    [rsldate, msgkey, phone], (err, result, fields) => {
                      if (err) {
                        console.log(err);
                        return;
                      }
                      if (result.affectedRows > 0) {
                        console.log('Update Successfully!!!!');
                      }
                    });
                  // insert into SMS monthly

                  db.query('create table sms_log_' + table_monthly + ' as select * from sms_msg where 1=0;', (err, result, fields) => {
                    if (err) {
                      console.log('create table sms_log_' + table_monthly + ' as select * from sms_msg where 1=0;' + err);
                    }
                    db.query('insert into sms_log_' + table_monthly + ' select * from sms_msg WHERE STATUS = 3 AND MSGKEY = ? AND PHONE = ?', [msgkey, phone], (err, result, fields) => {
                      if (err) {
                        console.log(err);
                        return;
                      }
                      console.log('insert into sms_log_' + table_monthly + ' select * from sms_msg WHERE STATUS = 3 AND MSGKEY = ? AND PHONE = ? [' + msgkey + '] - [' + phone + ']');
                      // delete data from SMS_MSG
                      db.query('DELETE FROM sms_msg WHERE STATUS = 3 AND MSGKEY = ? AND PHONE = ?', [msgkey, phone], (err, result, fields) => {
                        if (err) {
                          console.log(err);
                          return;
                        }
                        console.log('DELETE FROM sms_msg WHERE STATUS = 3 AND MSGKEY = ? AND PHONE = ? [' + msgkey + '] [' + phone + ']');
                      });
                    });
                  });
                  onComplete(count, maxlength);
                })
                .catch(function (error) {
                  console.log(error);
                  onComplete(0, 0);
                });

            });
          }).catch(function (error) {
            console.log(error);
            onComplete(0, 0);
          });
      } else {
        onComplete(0, 0);
      }
    });
  }
};
