module.exports = {
    isEmptyJson:function(obj) {
        return !Object.keys(obj).length > 0;
    },
    isEmptyStr:function(str) {
        return (!str || 0 === str.length || str === undefined || str === null);
    }
};