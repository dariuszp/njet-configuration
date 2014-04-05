'use strict';

require('should');

var yamlLoader = require(__dirname + '/../src/loader/file.js');

describe('loader/file', function () {
    describe('.load()', function () {
        it('should return { this: "is" }', function () {
            var obj = yamlLoader.load(__dirname + '/yaml/file1.yml');
            obj.should.be.instanceof(Object);
            obj.should.have.property('this');
            obj.should.not.have.property('sparta');
            obj.this.should.equal('is');
        });

        it('should return object', function () {
            var obj = yamlLoader.load(__dirname + '/yaml/file2.yml');
            obj.should.be.instanceof(Object);
            obj.should.have.property('what');
            obj.what.should.equal('sparta');
        });
    });
});