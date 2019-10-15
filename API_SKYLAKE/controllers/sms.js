var fptsms = require('../app').fptsms;
var config = require('../config/config');

module.exports = class smsDb {
  // Cron job notification
  cron(db, onComplete) {
    this.getSMSList(db, (err) => {
        onComplete(0, 0);
      },
      (result) => {
        var count = 0;
        var maxLength = result.length;
        result.forEach(sms => {
          console.log('get token');
          /*
          fptsms.getToken(config.TOKEN.GRANT_TYPE, config.TOKEN.CLIENT_ID, config.TOKEN.CLIENT_SECRET, config.TOKEN.SCOPE, config.TOKEN.SESSION_ID,
            () => {
              console.log(error);
            },
            () => {
              console.log(response);
            }
          ); */
        });
      });
  }

  getSMSList(db, onError, onSuccess) {
    db.query('SELECT MSGKEY, COMPKEY, ID, PHONE, CALLBACK, STATUS, WRTDATE, REQDATE, RSLTDATE, REPORTDATE, TERMINATEDDATE, EXPIRETIME, RSLT, MSG, `TYPE`, SENDCNT, SENTDATE, TELCOINFO, ETC1, ETC2, ETC3, ETC4 FROM SMS_MSG.SMSMSG ORDER BY REQDATE', (err, result, fields) => {
      if (err) {
        console.log(err);
        onError(err);
        return;
      }

      if (result.length < 1) {
        onError(undefined);
        return;
      }

      onSuccess(result);
    });
  }

  updateNoti(db, pushId, deviceId, msgTp, msgTitle, msgContent, reqDt, senderNm, residentUserId, managerUserId) {
    db.query('DELETE FROM M_PUSH_MSG WHERE PUSH_ID = ?', [pushId], (err, result, fields) => {
      if (err) {
        console.log(err);
        return;
      }

      var movDt = (new Date()).getTime();
      db.query('INSERT INTO M_PUSH_MSG_HIS(M_DEVICE_ID, MSG_TYPE, MSG_TITLE, MSG_CONTENT, REQ_DT, MOV_DT, SENDER_NM, RESIDENT_USER_ID, MANAGER_USER_ID) values(?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [deviceId, msgTp, msgTitle, msgContent, reqDt, movDt, senderNm, residentUserId, managerUserId], (err, result, fields) => {});
    });
  }
}
