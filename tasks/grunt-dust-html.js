/*
 * Grunt Dust-HTML
 * https://github.com/ehynds/grunt-dust-html
 *
 * Copyright (c) 2013 Eric Hynds
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  "use strict";

  grunt.registerMultiTask("dusthtml", "Render Dust templates against a context to produce HTML", function() {
    var src = this.file.src;
    var dest = this.file.dest;
    var dust;

    if(!src) {
      grunt.fatal("Missing src property.");
      return;
    }

    if(!dest) {
      grunt.fatal("Missing dest property");
      return;
    }

    // find me some dust
    try {
      dust = require("dust");
    } catch(e) {
      dust = require("dustjs-linkedin");
    }

    var path = require("path");
    var fs = require("fs");
    var opts = this.data.options;
    var done = this.async();

    // Load includes/partials from the filesystem properly
    dust.onLoad = function(filePath, callback) {
      // Make sure the file to load has the proper extension
      if(!path.extname(filePath).length) {
        filePath += ".dust";
      }

      if(filePath.charAt(0) !== "/") {
        filePath = (opts.basePath || ".") + "/" + filePath;
      }

      fs.readFile(filePath, "utf8", function(err, html) {
        if(err) {
          grunt.warn("Template " + err.path + " does not exist");
          return callback(err);
        }

        callback(null, html);
      });
    };

    grunt.file.expandFiles(src).forEach(function(srcFile) {
      var tmpl = dust.compileFn(grunt.file.read(src));
      var context = opts.context || {};

      // preserve whitespace?
      if(opts.whitespace) {
        dust.optimizers.format = function(ctx, node) {
          return node;
        };
      }

      // if context is a string assume it's a file location
      if(typeof context === "string") {
        try {
          context = JSON.parse(grunt.file.read(opts.context));
        } catch(e) {
          grunt.fatal("An error occurred parsing " + opts.context + ". Is it valid JSON?");
        }
      }

      // parse and save as html
      tmpl(context, function(err, html) {
        grunt.file.write(dest, html);
        grunt.log.writeln('File "' + dest + '" created.');
        done();
      });
    });
  });

};
