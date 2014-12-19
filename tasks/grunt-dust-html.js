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
  var async = require('async');

  grunt.registerMultiTask('dusthtml', 'Render Dust templates against a context to produce HTML', function() {
    var done = this.async();
    var opts = this.options();

    async.each(this.files, function(file, callback) {
      file.src.forEach(function(filepath) {
        var input = grunt.file.read(filepath);

        dusthtml.render(input, opts, function(err, html) {
          grunt.file.write(file.dest, html);
          grunt.log.writeln('File "' + file.dest + '" created.');
        });
      });
    }, done);
  });
};
