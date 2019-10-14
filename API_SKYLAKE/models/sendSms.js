var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var sendSMS = new Schema({
  brandName: {
    type: String
  },
  msgType: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  msgContent: {
    type: String
  },
  sendTime: {
    type: String
  },
}, {
  collection: 'sendSMS'
});

module.exports = mongoose.model('sendSMS', sendSMS);
