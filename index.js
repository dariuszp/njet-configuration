'use strict';

var util        = require('util'),
    expect      = require('cruks-lib-config').expect,
    loader      = require(__dirname + '/src/loader/loader.js'),
    extend      = require('node.extend');

/**
 *
 * @param options
 * - loader - file loader that implement .load() method
 * - expect - configuration validator
 * @returns {Configuration}
 * @constructor
 */
function Configuration(options) {
    if (!(this instanceof Configuration)) {
        return new Configuration(options);
    }

    if ((options instanceof Object) === false) {
        options = {};
    }

    var config = {},
        encoding = 'utf8';

    this.expect = options.expect || expect;

    this.loader = options.loader || loader;


    this.setEncoding = function (newEncoding) {
        encoding = newEncoding;
        return this;
    };


    this.getEncoding = function () {
        return encoding;
    };


    this.getConfiguration = function () {
        return config;
    };


    this.get = function (name) {
        return config[name];
    };


    this.set = function (name, value) {
        config[name] = value;
        return this;
    };


    this.getDataFromPath = function (path) {
        var data;
        try {
            data = this.loader.load(path, encoding);
        } catch (e) {
            throw new Error('Error while loading configuration');
        }
        if (data === false) {
            throw new Error('Unable to load configuration');
        }
        return data;
    };

    this.load = function (path) {
        config = this.getDataFromPath(path);
        return this;
    };

    this.merge = function (path) {
        var data = this.getDataFromPath(path);
        extend(config, data);
        return this;
    };
}

module.exports = {
    create: function (rootDir) {
        return new Configuration(rootDir);
    },
    Configuration: Configuration
};