/* global describe:true  */
"use strict";

require('dustjs-linkedin');
require('dustjs-helpers');
var dust = require('dustjs-helpers-extra');

var grunt = require('grunt');
require('../tasks/grunt-dust-html')(grunt);

var assert = require('assert');

describe('iterate', function () {

  it('non existing iterate key', function () {

    grunt.task.init = function () {
    };

    grunt.initConfig({
      dusthtml: {
        failTest: {
          src: "test/templates/non-existing-iter-key.dust.html",
          dest: "test/output/non-existing-iter-key.html",
          options: {
            module: 'dustjs-helpers-extra',
            context: [
              {"myObject": {"1": "value1"}}
            ]
          }
        },
        okTest: {
          src: "test/templates/non-existing-iter-key.dust.html",
          dest: "test/output/non-existing-iter-key.html",
          options: {
            module: 'dustjs-helpers-extra',
            context: [
              {"text": {"1": "value1"}}
            ]
          }
        }
      }
    });

    // Finally run the tasks, with options and a callback when we're done
    grunt.tasks(['dusthtml'], {}, function () {
      grunt.log.ok('Done running dusthtml.');
    });

  });

});
