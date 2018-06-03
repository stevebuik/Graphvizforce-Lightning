var soql = require('./soql.js');

module.exports = {
    soql: soql,
    testFoo: function (c) {
        return "foo " + c;
    }
};
