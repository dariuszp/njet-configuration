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
        encoding = 'utf8',
        validators = [],
        schema,
        isValid = false,
        wasValidate =  false;

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
        isValid = false;
        wasValidate = false;
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
        isValid = false;
        wasValidate = false;
        return this;
    };

    this.merge = function (path, isNotDeep) {
        var data = this.getDataFromPath(path);
        if (isNotDeep) {
            extend(config, data);
        } else {
            extend(true, config, data);
        }
        isValid = false;
        wasValidate = false;
        return this;
    };

    this.schema = function (schemaConfigObject) {
        if ((typeof schemaConfigObject) !== 'object') {
            throw new Error('Schema expect schema object');
        }
        schema = this.expect.schema(schemaConfigObject);
        isValid = false;
        wasValidate = false;
        return this;
    };

    this.clearSchema = function () {
        schema = undefined;
    };

    this.getSchema = function () {
        return schema;
    };

    this.setValidators = function (validatorsArray) {
        validators = [];
        var i;
        for (i = 0; i < validatorsArray.length; i++) {
            this.addValidator(validatorsArray[i]);
        }
        return this;
    };

    this.addValidator = function (validator) {
        if ((typeof validator) !== 'function') {
            throw new Error('Validator must be a function');
        }
        validators.push(validator);
        isValid = false;
        wasValidate = false;
        return this;
    };

    this.clearValidators = function () {
        validators = [];
        isValid = false;
        wasValidate = false;
        return this;
    };

    this.validate = function () {
        var isValid = true;
        if (schema) {
            try {
                schema.assert(config);
            } catch (e) {
                isValid = false;
                console.error(e.message);
            }
        }
        var i;
        for (i = 0; i < validators.length; i++) {
            if (validators[i](config) === false) {
                isValid = false;
                break;
            }
        }
        return isValid;
    };
}

module.exports = {
    create: function (rootDir) {
        return new Configuration(rootDir);
    },
    Configuration: Configuration
};