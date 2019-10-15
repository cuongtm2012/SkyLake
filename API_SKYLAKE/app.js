var express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  config = require('./config/config'),
  smsRoutes = require('./route/smsRoutes');
var app = express();
var mysql = require('mysql');
var myConnection = require('express-myconnection');
var fpt = require('./controllers/fpt');
var cron = require('node-cron');
app.use(bodyParser.json());
app.use(cors());

var jobSMS = require('./job-sms');

var pool = mysql.createPool({
  connectionLimit: 10,
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  port: config.database.port,
  database: config.database.database,
});

var dbOptions = {
	host: config.database.host,
	user: config.database.user,
	password: config.database.password,
	port: config.database.port,
	database: config.database.db
};
app.use(myConnection(mysql, dbOptions, 'pool'));

var port = process.env.PORT || 4000;
app.use('/sms', smsRoutes);

cron.schedule('*/1 * * * *', () => {
  console.log('running a task every two minutes');
  jobSMS.start(pool);
});

var server = app.listen(port, function () {
  console.log('Listening on port ' + port);
});

exports.fptsms = new fpt();