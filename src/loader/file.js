'use strict';

var yaml = require('js-yaml'),
    fs   = require('fs');

module.exports = {
    load: function (path, encoding) {
        if (!fs.existsSync(path)) {
            return false;
        }
        try {
            var doc = yaml.safeLoad(fs.readFileSync(path, encoding || 'utf8'));
            if (!(doc instanceof Object)) {
                doc = false;
            }
            return doc;
        } catch (e) {
            return false;
        }
    }
};