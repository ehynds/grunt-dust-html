/*
 * Grunt Dust-HTML
 * https://github.com/ehynds/grunt-dust-html
 *
 * Copyright (c) 2014 Eric Hynds
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  "use strict";

  var dusthtml = require('./lib/dusthtml');
  var Promise = require('bluebird');

  grunt.registerMultiTask('dusthtml', 'Render Dust templates against a context to produce HTML', function() {
    var done = this.async();
    var opts = this.options();
    var dfds = [];

    this.files.forEach(function(file) {
      dfds = file.src.map(function(filepath) {
        var input = grunt.file.read(filepath);

        return new Promise(function(resolve, reject) {
          dusthtml.render(input, opts, function(err, html) {
            if(err) {
              return reject(err);
            }

            grunt.file.write(file.dest, html);
            grunt.log.ok('File "' + file.dest + '" created.');
            resolve();
          });
        });
      });
    });

    Promise.all(dfds).then(done).catch(grunt.fail.fatal);
  });
};
