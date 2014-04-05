'use strict';

var util        = require('util'),
    fs          = require('fs');

function Configuration(rootDir) {
    if (!(this instanceof Configuration)) {
        return new Configuration(rootDir);
    }
}

module.exports = {
    create: function (rootDir) {
        return new Configuration(rootDir);
    },
    Configuration: Configuration
};