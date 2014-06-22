'use strict';

var yaml = require('js-yaml'),
    fs   = require('fs');

module.exports = {
    load: function (path, encoding) {
        return yaml.safeLoad(fs.readFileSync(path, encoding || 'utf8'));
    }
};