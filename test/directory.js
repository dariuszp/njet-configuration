'use strict';

require('should');

var yamlLoader = require(__dirname + '/../src/loader/directory.js');

describe('loader/directory', function () {
    describe('.load()', function () {
        it('should return { file1: { this: "is" }, file2: { this: "sparta", what: "sparta" } }', function () {
            var obj = yamlLoader.load(__dirname + '/yaml');
            obj.should.be.instanceof(Object);
            obj.should.have.property('file1');
            obj.file1.should.have.property('this');
            obj.should.have.property('file2');
            obj.file2.should.have.property('what');
            obj.file1.this.should.equal('is');
            obj.file2.what.should.equal('sparta');
        });
    });
});