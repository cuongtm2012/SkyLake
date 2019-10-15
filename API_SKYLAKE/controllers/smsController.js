var validation = require('../util/validation');

exports.smslist = function (req, res) {
	req.getConnection(function (error, conn) {
		if (!conn) {
			res.status(404).send();
			return;
		}
		conn.query('SELECT MSGKEY, COMPKEY, ID, PHONE, CALLBACK, STATUS, DATE_FORMAT(WRTDATE, \'%m/%d/%Y %H:%i\') AS WRTDATE, DATE_FORMAT(REQDATE, \'%m/%d/%Y %H:%i\') AS REQDATE, DATE_FORMAT(RSLTDATE, \'%m/%d/%Y %H:%i\') AS RSLTDATE, DATE_FORMAT(REPORTDATE, \'%m/%d/%Y %H:%i\') AS REPORTDATE, DATE_FORMAT(TERMINATEDDATE, \'%m/%d/%Y %H:%i\') AS TERMINATEDDATE, EXPIRETIME, RSLT, MSG, `TYPE`, SENDCNT, DATE_FORMAT(SENTDATE, \'%m/%d/%Y %H:%i\') AS SENTDATE, TELCOINFO, ETC1, ETC2, ETC3, ETC4 FROM SMS_MSG.SMSMSG ORDER BY REPORTDATE', function (err, rows, fields) {
			if (err || validation.isEmptyJson(rows)) {
				console.log(err);
				res.status(404).json({ 'msg': err });
			} else {
				console.log('OK');
				res.status(200).send(rows);
			}
		});
	});
};

