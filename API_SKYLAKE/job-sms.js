// Database
var smsDB = require('./controllers/sms');
var smsDB = new smsDB();
var TIME_OUT = 5000;

module.exports.start = function (pool) {
  setTimeout(() => {
    smsDB.cron(pool, (current, max) => {
      if (current == max) {
        this.start(pool);
      }
    });
  }, TIME_OUT);
}
