var config = require('../config/config');
var axios = require('axios');
var dateutil = require('../util/dateUtil');
var validate = require('../util/validation');
var log4js = require('log4js');
log4js.configure({
  appenders: { 'file': { type: 'file', filename: 'logs/skylake.log' } },
  categories: { default: { appenders: ['file'], level: 'debug' } }
});
var logger = log4js.getLogger('skylake');

module.exports = class smsDb {
  // Cron job notification
  cron(db, onComplete) {
    var cskhArr = [];
    var qcArr = [];
    db.getConnection(function (err, connection) {
      if (err) {
        onComplete(0, 0);
        return;
      }
      connection.query('SELECT MSGKEY, COMPKEY, ID, PHONE, CALLBACK, STATUS, WRTDATE, REQDATE, RSLTDATE, REPORTDATE, TERMINATEDDATE, EXPIRETIME, RSLT, MSG, `TYPE`, SENDCNT, SENTDATE, TELCOINFO, ETC1, ETC2, ETC3, ETC4 FROM skylakecc_erp.sms_msg WHERE STATUS = 0 OR RSLT != 06 ORDER BY REQDATE', (err, result, fields) => {
        if (db._freeConnections.indexOf(connection) < 0) {
          connection.release();
        }
        if (err) {
          logger.info(err);
          onComplete(0, 0);
          return;
        }
        if (result.length < 1) {
          onComplete(0, 0);
          return;
        } else {
          result.forEach(sms => {
            var currentTime = new Date().getTime();
            var requestDate = new Date(sms.REQDATE).getTime();
            if (sms.ETC4 == 0) {
              if (currentTime > requestDate) {
                cskhArr.push({
                  'MSGKEY': sms.MSGKEY,
                  'PHONE': sms.PHONE,
                  'MSG': sms.MSG
                });
              }
            } else {
              qcArr.push({
                'MSGKEY': sms.MSGKEY,
                'PHONE': sms.PHONE,
                'MSG': sms.MSG,
                'REQDATE': sms.REQDATE,
              });
            }
          });
        }
        // Send SMS CSKH
        if (cskhArr.length > 0) {
          var count = 0;
          var maxlength = cskhArr.length;

          var fpt_token = '';
          var body_token = {
            "grant_type": config.TOKEN.GRANT_TYPE,
            "client_id": config.TOKEN.CLIENT_ID,
            "client_secret": config.TOKEN.CLIENT_SECRET,
            "scope": config.TOKEN.SCOPE_BRANDNAME_OTP,
            "session_id": config.TOKEN.SESSION_ID
          };

          axios.post(config.TOKEN.URL, body_token)
            .then(function (response) {
              fpt_token = response.data.access_token;
              cskhArr.forEach(sms => {
                var msgkey = sms.MSGKEY;
                var phone = sms.PHONE;
                var msg = sms.MSG;
                if (phone !== null && phone !== undefined && phone.length !== 0 && !validate.isEmptyStr(msg)) {
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
                      var rsldate = dateutil.dateYYYYMMDDHHmmss();
                      var table_monthly = dateutil.dateYYYYMM();
                      // update SMSMSG table
                      connection.query('UPDATE skylakecc_erp.sms_msg SET STATUS = 3, RSLT = 06, RSLTDATE = ? WHERE MSGKEY = ? AND PHONE = ?',
                        [rsldate, msgkey, phone],
                        function (err, result, fields) {
                          if (db._freeConnections.indexOf(connection) < 0) {
                            connection.release();
                          }
                          if (err) {
                            logger.info(err);
                            return;
                          }
                          if (result) {
                            connection.query('create table skylakecc_erp.sms_log_' + table_monthly + ' as select * from skylakecc_erp.sms_msg where 1=0;', function (err, result, fields) {
                              if (err) {
                                logger.info('create table skylakecc_erp.sms_log_' + table_monthly + ' as select * from skylakecc_erp.sms_msg where 1=0;' + err);
                              }
                              connection.query('insert into skylakecc_erp.sms_log_' + table_monthly + ' select * from skylakecc_erp.sms_msg WHERE STATUS = 3 AND MSGKEY NOT IN (SELECT MSGKEY FROM skylakecc_erp.sms_log_' + table_monthly + ')', function (err, result, fields) {
                                if (db._freeConnections.indexOf(connection) < 0) {
                                  connection.release();
                                }
                                if (err) {
                                  logger.info(err);
                                  return;
                                }
                                // delete data from SMS_MSG
                                connection.query('DELETE FROM skylakecc_erp.sms_msg WHERE STATUS = 3 AND MSGKEY = ? ', [msgkey], function (err, result, fields) {
                                  count++;
                                  if (db._freeConnections.indexOf(connection) < 0) {
                                    connection.release();
                                  }
                                  if (err) {
                                    logger.info(err);
                                    return;
                                  }
                                  onComplete(count, maxlength);
                                });
                              });
                            });
                          }
                        });
                    })
                    .catch(function (error) {
                      if (error.response) {
                        logger.info(error.response);
                      }
                      // Update data sms_msg to log table
                      var rsldate = dateutil.dateYYYYMMDDHHmmss();
                      var table_monthly = dateutil.dateYYYYMM();
                      connection.query('UPDATE skylakecc_erp.sms_msg SET STATUS = 1, RSLT = 90, RSLTDATE = ? WHERE MSGKEY = ? AND PHONE = ?',
                        [rsldate, msgkey, phone],
                        function (err, result, fields) {
                          if (db._freeConnections.indexOf(connection) < 0) {
                            connection.release();
                          }
                          if (err) {
                            logger.info(err);
                            return;
                          }
                          if (result) {
                            connection.query('create table skylakecc_erp.sms_log_' + table_monthly + ' as select * from skylakecc_erp.sms_msg where 1=0;', function (err, result, fields) {
                              if (err) {
                                logger.info('create table skylakecc_erp.sms_log_' + table_monthly + ' as select * from skylakecc_erp.sms_msg where 1=0;' + err);
                              }
                              connection.query('insert into skylakecc_erp.sms_log_' + table_monthly + ' select * from skylakecc_erp.sms_msg WHERE STATUS = 1 AND MSGKEY = ? AND MSGKEY NOT IN (SELECT MSGKEY FROM skylakecc_erp.sms_log_' + table_monthly + ')', [msgkey], function (err, result, fields) {
                                if (db._freeConnections.indexOf(connection) < 0) {
                                  connection.release();
                                }
                                if (err) {
                                  logger.info(err);
                                  return;
                                }
                                // delete data from SMS_MSG
                                connection.query('DELETE FROM skylakecc_erp.sms_msg WHERE STATUS = 1 AND MSGKEY = ?', [msgkey], function (err, result, fields) {
                                  count++;
                                  if (db._freeConnections.indexOf(connection) < 0) {
                                    connection.release();
                                  }
                                  if (err) {
                                    logger.info(err);
                                    return;
                                  }
                                  onComplete(count, maxlength);
                                });
                              });
                            });
                          }
                        });
                      onComplete(0, 0);
                    });
                } else {
                  // Update data sms_msg to log table.
                  var rsldate = dateutil.dateYYYYMMDDHHmmss();
                  var table_monthly = dateutil.dateYYYYMM();
                  connection.query('UPDATE skylakecc_erp.sms_msg SET STATUS = 1, RSLT = 90, RSLTDATE = ? WHERE MSGKEY = ?',
                    [rsldate, msgkey],
                    function (err, result, fields) {
                      if (db._freeConnections.indexOf(connection) < 0) {
                        connection.release();
                      }
                      if (err) {
                        logger.info(err);
                        return;
                      }
                      if (result) {
                        connection.query('create table skylakecc_erp.sms_log_' + table_monthly + ' as select * from skylakecc_erp.sms_msg where 1=0;', function (err, result, fields) {
                          if (err) {
                            logger.info('create table skylakecc_erp.sms_log_' + table_monthly + ' as select * from skylakecc_erp.sms_msg where 1=0;' + err);
                          }
                          connection.query('insert into skylakecc_erp.sms_log_' + table_monthly + ' select * from skylakecc_erp.sms_msg WHERE STATUS = 1 AND MSGKEY = ? AND MSGKEY NOT IN (SELECT MSGKEY FROM skylakecc_erp.sms_log_' + table_monthly + ')', [msgkey], function (err, result, fields) {
                            if (db._freeConnections.indexOf(connection) < 0) {
                              connection.release();
                            }
                            if (err) {
                              logger.info(err);
                              return;
                            }
                            // delete data from SMS_MSG
                            connection.query('DELETE FROM skylakecc_erp.sms_msg WHERE STATUS = 1 AND MSGKEY = ? ', [msgkey], function (err, result, fields) {
                              count++;
                              if (db._freeConnections.indexOf(connection) < 0) {
                                connection.release();
                              }
                              if (err) {
                                logger.info(err);
                                return;
                              }
                              onComplete(count, maxlength);
                            });
                          });
                        });
                      }
                    });
                  onComplete(0, 0);
                }
              });
            }).catch(function (error) {
              logger.info(error);
              onComplete(0, 0);
            });
        } else {
          onComplete(0, 0);
        }

        // Send SMS Quang cao
        if (qcArr.length > 0) {
          var count = 0;
          var maxlength = qcArr.length;

          var fpt_token = '';
          var body_token = {
            "grant_type": config.TOKEN.GRANT_TYPE,
            "client_id": config.TOKEN.CLIENT_ID,
            "client_secret": config.TOKEN.CLIENT_SECRET,
            "scope": config.TOKEN.SCOPE_BRANDNAME,
            "session_id": config.TOKEN.SESSION_ID
          };

          axios.post(config.TOKEN.URL, body_token)
            .then(function (response) {
              fpt_token = response.data.access_token;
              qcArr.forEach(sms => {
                count++;
                var msgkey = sms.MSGKEY;
                var phone = sms.PHONE;
                var msg = sms.MSG;
                var reqdate = dateutil.dateYYYYMMDDHHmm(sms.REQDATE);
                if (phone !== null && phone !== undefined && phone.length !== 0 && !validate.isEmptyStr(msg)) {
                  // Send SMS
                  var body_create_campain = {
                    "access_token": fpt_token,
                    "session_id": config.SEND_CREATE_CAMPAIN.SESSION_ID,
                    "CampaignName": config.SEND_CREATE_CAMPAIN.CAMPAIN_NAME + dateutil.currentTime(),
                    "BrandName": config.SEND_CREATE_CAMPAIN.BRAND_NAME,
                    "ScheduleTime": reqdate,
                    "Quota": config.SEND_CREATE_CAMPAIN.QUOTA,
                    "Message": Buffer.from(msg).toString('base64')
                  };
                  axios.post(config.SEND_CREATE_CAMPAIN.URL, body_create_campain)
                    .then(function (response) {
                      var campain_code = response.data.CampaignCode;
                      if (campain_code != null && campain_code != undefined) {
                        var body_send_qc = {
                          "access_token": fpt_token,
                          "session_id": config.SEND_SMS_QC.SESSION_ID,
                          "CampaignCode": campain_code,
                          "PhoneList": phone
                        };
                        axios.post(config.SEND_SMS_QC.URL, body_send_qc)
                          .then(function (response) {
                            if (response.data.NumMessageSent > 0) {
                              var rsldate = dateutil.dateYYYYMMDDHHmmss();
                              var table_monthly = dateutil.dateYYYYMM();

                              // update SMSMSG table
                              var updateQuery = connection.query('UPDATE skylakecc_erp.sms_msg SET STATUS = 3, RSLT = 06, RSLTDATE = ? WHERE MSGKEY = ? AND PHONE = ?',
                                [rsldate, msgkey, phone], (err, result, fields) => {
                                  if (db._freeConnections.indexOf(connection) < 0) {
                                    connection.release();
                                  }
                                  if (err) {
                                    logger.info(err);
                                    return;
                                  }
                                  if (result.affectedRows > 0) {
                                    // insert into SMS monthly
                                    connection.query('create table skylakecc_erp.sms_log_' + table_monthly + ' as select * from skylakecc_erp.sms_msg where 1=0;', function (err, result, fields) {
                                      if (db._freeConnections.indexOf(connection) < 0) {
                                        connection.release();
                                      }
                                      if (err) {
                                        logger.info('create table skylakecc_erp.sms_log_' + table_monthly + ' as select * from skylakecc_erp.sms_msg where 1=0;' + err);
                                      }
                                      connection.query('insert into skylakecc_erp.sms_log_' + table_monthly + ' select * from skylakecc_erp.sms_msg WHERE STATUS = 3 AND MSGKEY = ? AND MSGKEY NOT IN (SELECT MSGKEY FROM skylakecc_erp.sms_log_' + table_monthly + ')', [msgkey], function (err, result, fields) {
                                        if (db._freeConnections.indexOf(connection) < 0) {
                                          connection.release();
                                        }
                                        if (err) {
                                          logger.info(err);
                                          return;
                                        }
                                        // delete data from SMS_MSG
                                        connection.query('DELETE FROM skylakecc_erp.sms_msg WHERE STATUS = 3 AND MSGKEY = ? ', [msgkey], function (err, result, fields) {
                                          if (db._freeConnections.indexOf(connection) < 0) {
                                            connection.release();
                                          }
                                          if (err) {
                                            logger.info(err);
                                            return;
                                          }
                                        });
                                      });
                                    });
                                    onComplete(count, maxlength);
                                  }
                                });
                            }
                          });
                      }
                    })
                    .catch(function (error) {
                      if (error.response) {
                        logger.info(error.response);
                      }
                      // Update data sms_msg to log table
                      var rsldate = dateutil.dateYYYYMMDDHHmmss();
                      var table_monthly = dateutil.dateYYYYMM();
                      connection.query('UPDATE skylakecc_erp.sms_msg SET STATUS = 1, RSLT = 90, RSLTDATE = ? WHERE MSGKEY = ?',
                        [rsldate, msgkey],
                        function (err, result, fields) {
                          if (db._freeConnections.indexOf(connection) < 0) {
                            connection.release();
                          }
                          if (err) {
                            logger.info(err);
                            return;
                          }
                          if (result) {
                            connection.query('create table skylakecc_erp.sms_log_' + table_monthly + ' as select * from skylakecc_erp.sms_msg where 1=0;', function (err, result, fields) {
                              if (err) {
                                logger.info('create table skylakecc_erp.sms_log_' + table_monthly + ' as select * from skylakecc_erp.sms_msg where 1=0;' + err);
                              }
                              connection.query('insert into skylakecc_erp.sms_log_' + table_monthly + ' select * from skylakecc_erp.sms_msg WHERE STATUS = 1 AND MSGKEY = ?  AND MSGKEY NOT IN (SELECT MSGKEY FROM skylakecc_erp.sms_log_' + table_monthly + ')', [msgkey], function (err, result, fields) {
                                if (db._freeConnections.indexOf(connection) < 0) {
                                  connection.release();
                                }
                                if (err) {
                                  logger.info(err);
                                  return;
                                }
                                // delete data from SMS_MSG
                                connection.query('DELETE FROM skylakecc_erp.sms_msg WHERE STATUS = 1 AND MSGKEY = ?', [msgkey], function (err, result, fields) {
                                  count++;
                                  if (db._freeConnections.indexOf(connection) < 0) {
                                    connection.release();
                                  }
                                  if (err) {
                                    logger.info(err);
                                    return;
                                  }
                                  onComplete(count, maxlength);
                                });
                              });
                            });
                          }
                        });
                      onComplete(0, 0);
                    });
                } else {
                  // Update data sms_msg to log table.
                  var rsldate = dateutil.dateYYYYMMDDHHmmss();
                  var table_monthly = dateutil.dateYYYYMM();
                  connection.query('UPDATE skylakecc_erp.sms_msg SET STATUS = 1, RSLT = 90, RSLTDATE = ? WHERE MSGKEY = ?',
                    [rsldate, msgkey],
                    function (err, result, fields) {
                      if (db._freeConnections.indexOf(connection) < 0) {
                        connection.release();
                      }
                      if (err) {
                        logger.info(err);
                        return;
                      }
                      if (result) {
                        connection.query('create table skylakecc_erp.sms_log_' + table_monthly + ' as select * from skylakecc_erp.sms_msg where 1=0;', function (err, result, fields) {
                          if (err) {
                            logger.info('create table skylakecc_erp.sms_log_' + table_monthly + ' as select * from skylakecc_erp.sms_msg where 1=0;' + err);
                          }
                          connection.query('insert into skylakecc_erp.sms_log_' + table_monthly + ' select * from skylakecc_erp.sms_msg WHERE STATUS = 1 AND MSGKEY = ? AND MSGKEY NOT IN (SELECT MSGKEY FROM skylakecc_erp.sms_log_' + table_monthly + ')', [msgkey], function (err, result, fields) {
                            if (db._freeConnections.indexOf(connection) < 0) {
                              connection.release();
                            }
                            if (err) {
                              logger.info(err);
                              return;
                            }
                            // delete data from SMS_MSG
                            connection.query('DELETE FROM skylakecc_erp.sms_msg WHERE STATUS = 1 AND MSGKEY = ? ', [msgkey], function (err, result, fields) {
                              count++;
                              if (db._freeConnections.indexOf(connection) < 0) {
                                connection.release();
                              }
                              if (err) {
                                logger.info(err);
                                return;
                              }
                              onComplete(count, maxlength);
                            });
                          });
                        });
                      }
                    });
                  onComplete(0, 0);
                }
              });
            }).catch(function (error) {
              logger.info(error);
              onComplete(0, 0);
            });
        } else {
          onComplete(0, 0);
        }
      });
    });
  }
};
