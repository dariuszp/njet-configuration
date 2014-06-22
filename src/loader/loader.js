'use strict';

var fileLoader      = require(__dirname + '/file.js'),
    dirLoader       = require(__dirname + '/directory.js'),
    fs              = require('fs');

module.exports = {
    load: function (path, encoding) {
        if (!fs.existsSync(path)) {
            return false;
        }
        path = fs.realpathSync(path);
        if (!path) {
            return false;
        }
        path = path.replace('\\', '/');

        if (fs.lstatSync(path).isDirectory()) {
            return dirLoader.load(path, encoding);
        }
        if (fs.lstatSync(path).isFile()) {
            return fileLoader.load(path, encoding);
        }
        return false;
    },
    file: fileLoader.load,
    directory: dirLoader.load
};