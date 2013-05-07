/*global describe, it, require, beforeEach*/
"use strict";

var fs = require("fs"),
  path = require("path"),
  should = require("should"),
  Configurator = require("../src/configurator.js"),
  configurator;

describe('configuration', function(){

  beforeEach(function() {
    configurator = new Configurator(fs, path);
  });

  describe('get config in relative file directory', function() {
    it('should find a .jshint file in the specified directory', function() {
      var actualConfig = configurator.getJshintConfig("./test/testfiles/");

      actualConfig.should.eql({"key1" : true});
    });

    it('should find a .jshint file in the parents directory', function() {
      var actualConfig = configurator.getJshintConfig("./test/testfiles/nestedTestDirectory1");

      actualConfig.should.eql({"key1" : true});
    });

    it('should find a jshint.json file in the same directory as a specified file', function() {
      var actualConfig = configurator.getJshintConfig("./test/testfiles/nestedTestDirectory2/dummyFile3.js");

      actualConfig.should.eql({"key2" : true});
    });

    it('should find a .jshint file in the parent directory of a specified file', function() {
      var actualConfig = configurator.getJshintConfig("./test/testfiles/nestedTestDirectory1/dummyfile1.js");

      actualConfig.should.eql({"key1" : true});
    });
  });

  describe('get config in absolute file directory', function() {
    it('should find a .jshint file in the specified directory', function() {
      var resolvedAbsolutePath = path.resolve("./test/testfiles/");
      var actualConfig = configurator.getJshintConfig(resolvedAbsolutePath);

      actualConfig.should.eql({"key1" : true});
    });

    it('should find a .jshint file in the parents directory', function() {
      var resolvedAbsolutePath = path.resolve("./test/testfiles/nestedTestDirectory1");
      var actualConfig = configurator.getJshintConfig(resolvedAbsolutePath);

      actualConfig.should.eql({"key1" : true});
    });

    it('should find a jshint.json file in the same directory as a specified file', function() {
      var resolvedAbsolutePath = path.resolve("./test/testfiles/nestedTestDirectory2/dummyFile3.js");
      var actualConfig = configurator.getJshintConfig(resolvedAbsolutePath);

      actualConfig.should.eql({"key2" : true});
    });

    it('should find a .jshint file in the parent directory of a specified file', function() {
      var resolvedAbsolutePath = path.resolve("./test/testfiles/nestedTestDirectory1/dummyfile1.js");
      var actualConfig = configurator.getJshintConfig(resolvedAbsolutePath);

      actualConfig.should.eql({"key1" : true});
    });
  });

  describe('with malformed path', function() {
    it('should find the correct .jshint file if the file does not exist', function() {
      var actualConfig = configurator.getJshintConfig("./test/testfiles/nestedTestDirectory1/missingFile.js");

      actualConfig.should.eql({"key1" : true});
    });
  });

});