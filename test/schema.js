'use strict';

require('should');

var njetConfiguration = require(__dirname + '/../index.js');

var config = njetConfiguration.create({
    verbosity: 0
});

describe('config/schema', function () {
    describe('.validate()', function () {
        it('should return true', function () {
            config.schema({
                x: config.expect.number()
            });

            config.load({
                x: 5
            });

            config.validate().should.be.ok;
        });

        it('should return false', function () {
            config.schema({
                x: config.expect.number(),
                y: config.expect.schema(config.createSchema({
                    z: config.expect.number()
                }))
            });

            config.validate().should.not.be.ok;
        });

        it('should return false', function () {

            config.merge({
                y: {
                    z: 4
                }
            });

            config.validate().should.be.ok;
        });
    });
});