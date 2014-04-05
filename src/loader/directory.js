'use strict';

var yamlLoader      = require(__dirname + '/file.js'),
    fs              = require('fs');

function getYamlName(filename) {
    filename = String(filename);
    return (filename.length > 4 && filename.substr(-4).toLowerCase() === '.yml') ? filename.substr(-4) : false;
}

module.exports = {
    load: function (path, encoding) {
        if (!fs.existsSync(path)) {
            return false;
        }
        path = fs.realpathSync(path);
        if (!path) {
            return false;
        }
        var files = fs.readdirSync(path),
            i,
            result = {},
            name;

        for (i = 0; i < files.length; i++) {
            if ((name = getYamlName(files[i])) !== false) {
                result[name] = yamlLoader.load(path + files[i]);
            }
        }

        return result;
    }
};