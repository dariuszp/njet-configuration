'use strict';

require('should');

var njetConfiguration = require(__dirname + '/../index.js');

var config = njetConfiguration.create({
    verbosity: 0
});

describe('loader/file', function () {
    describe('.validate()', function () {
        it('should return true', function () {
            config.load(__dirname + '/yaml/file1.yml');
            config.addValidator(function (config) {
                if (!config) {
                    return false;
                }
                if (!config['this']) {
                    return false;
                }
                if (config['this'] !== 'is') {
                    return false;
                }
                return true;
            });
            config.validate().should.be.ok;
        });

        it('should return false', function () {
            config.addValidator(function (config) {
                if (!config) {
                    return false;
                }
                if (!config.what) {
                    return false;
                }
                if (config.what !== 'sparta') {
                    return false;
                }
                return true;
            });
            config.validate().should.not.be.ok;
        });

        it('should return true', function () {
            config.merge(__dirname + '/yaml/file2.yml');
            config.validate().should.be.ok;
        });

        it('should return false', function () {
            config.schema({
                x: config.expect.number()
            });
            config.validate().should.not.be.ok;
        });

        it('should return false', function () {
            config.set('x', 'hey!');
            config.validate().should.not.be.ok;
        });

        it('should return false', function () {
            config.set('x', 5);
            config.validate().should.be.ok;
        });

        it('should return true', function () {
            config.merge({
                last: 'stand'
            });
            config.addValidator(function (config) {
                if (!config) {
                    return false;
                }
                if (!config.last) {
                    return false;
                }
                if (config.last !== 'stand') {
                    return false;
                }
            });
            config.validate().should.be.ok;
        });
    });
});