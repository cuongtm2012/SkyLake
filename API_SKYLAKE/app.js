var express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  config = require('./config/config');
var app = express();
var mysql = require('mysql');
var myConnection = require('express-myconnection');
var cron = require('node-cron');
app.use(bodyParser.json());
app.use(cors());

var jobSMS = require('./job-sms');

var pool = mysql.createPool({
  connectionLimit: 100,
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  port: config.database.port,
  database: config.database.database
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

jobSMS.start(pool);

var server = app.listen(port, function () {
  console.log('Listening on port ' + port);
});
