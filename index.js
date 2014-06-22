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
 * - verbosity - amount of messages printed by std output
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
        verbosity = options.verbosity || 0,
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


    this.load = function (pathOrObject) {
        if ((typeof pathOrObject) === 'object') {
            config = pathOrObject;
        } else {
            config = this.getDataFromPath(pathOrObject);
        }
        isValid = false;
        wasValidate = false;
        return this;
    };


    this.merge = function (pathOrObject, isNotDeep) {
        var data;
        if ((typeof pathOrObject) === 'object') {
            data = pathOrObject;
        } else {
            data = this.getDataFromPath(pathOrObject);
        }
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


    this.createSchema = function (schemaConfigObject) {
        if ((typeof schemaConfigObject) !== 'object') {
            throw new Error('Schema expect schema object');
        }
        return this.expect.schema(schemaConfigObject);
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
        var configIsValid = true;
        if (schema) {
            try {
                schema.assert(config);
            } catch (e) {
                configIsValid = false;
                if (verbosity > 0) {
                    console.error(e.message);
                }
            }
        }
        var i;
        for (i = 0; i < validators.length; i++) {
            if (validators[i](config) === false) {
                if (verbosity > 0) {
                    console.error(validators[i].toString());
                }
                configIsValid = false;
                break;
            }
        }
        isValid = configIsValid;
        wasValidate = true;
        return configIsValid;
    };

    this.isValid = function () {
        if (!wasValidate) {
            this.validate();
        }
        return isValid;
    };
}

module.exports = {
    create: function (options) {
        return new Configuration(options);
    },
    Configuration: Configuration
};