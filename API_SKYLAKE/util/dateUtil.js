module.exports = {
  dateYYYYMMDDHHmmss: function () {
    var d = new Date();
    d = new Date(d.getTime() - 3000000);
    var rsldate = d.getFullYear().toString() + "-" + ((d.getMonth() + 1).toString().length == 2 ? (d.getMonth() + 1).toString() : "0" +
      (d.getMonth() + 1).toString()) + "-" + (d.getDate().toString().length == 2 ? d.getDate().toString() : "0" +
      d.getDate().toString()) + " " + (d.getHours().toString().length == 2 ? d.getHours().toString() : "0" +
      d.getHours().toString()) + ":" + ((parseInt(d.getMinutes() / 5) * 5).toString().length == 2 ? (parseInt(d.getMinutes() / 5) * 5).toString() : "0" +
      (parseInt(d.getMinutes() / 5) * 5).toString()) + ":00";
    return rsldate;
  },
  dateYYYYMMDDHHmm: function (date) {
    var d = new Date(date);
    d = new Date(d.getTime() - 3000000);
    var rsldate = d.getFullYear().toString() + "-" + ((d.getMonth() + 1).toString().length == 2 ? (d.getMonth() + 1).toString() : "0" +
      (d.getMonth() + 1).toString()) + "-" + (d.getDate().toString().length == 2 ? d.getDate().toString() : "0" +
      d.getDate().toString()) + " " + (d.getHours().toString().length == 2 ? d.getHours().toString() : "0" +
      d.getHours().toString()) + ":" + ((parseInt(d.getMinutes() / 5) * 5).toString().length == 2 ? (parseInt(d.getMinutes() / 5) * 5).toString() : "0" +
      (parseInt(d.getMinutes() / 5) * 5).toString());
    return rsldate;
  },
  dateYYYYMM: function () {
    var d = new Date();
    var table_monthly = d.getFullYear().toString() + ((d.getMonth() + 1).toString().length == 2 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1).toString());
    return table_monthly;
  },
  currentTime: function () {
    var date = new Date();
    return date.getTime();
  }
};
