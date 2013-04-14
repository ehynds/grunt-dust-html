/*
 * Grunt Dust-HTML
 * https://github.com/ehynds/grunt-dust-html
 *
 * Copyright (c) 2013 Eric Hynds
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  "use strict";

  var path = require("path");
  var fs = require("fs");

  grunt.registerMultiTask("dusthtml", "Render Dust templates against a context to produce HTML", function() {
    var dust;

    // find me some dust
    try {
      dust = require("dust");
    } catch(err) {
      dust = require("dustjs-linkedin");
    }

    var done = this.async();
    var opts = this.options({
      basePath: ".",
      defaultExt: ".dust",
      whitespace: false,
      context: {}
    });

    // Load includes/partials from the filesystem properly
    dust.onLoad = function(filePath, callback) {
      // Make sure the file to load has the proper extension
      if(!path.extname(filePath).length) {
        filePath += opts.defaultExt;
      }

      if(filePath.charAt(0) !== "/") {
        filePath = opts.basePath + "/" + filePath;
      }

      fs.readFile(filePath, "utf8", function(err, html) {
        if(err) {
          grunt.warn("Template " + err.path + " does not exist");
          return callback(err);
        }

        try {
          callback(null, html);
        } catch(err) {
          parseError(err, filePath);
        }
      });
    };

    this.files.forEach(function(f) {
      f.src.forEach(function(srcFile) {
        var context, tmpl;

        try {
          tmpl = dust.compileFn(grunt.file.read(srcFile));
        } catch(err) {
          parseError(err, srcFile);
        }

        // preserve whitespace?
        if(opts.whitespace) {
          dust.optimizers.format = function(ctx, node) {
            return node;
          };
        }

        // if context is a string assume it's a file location
        if(typeof opts.context === "string") {
          try {
            context = grunt.file.readJSON(opts.context);
          } catch(e) {
            grunt.fatal("An error occurred parsing " + opts.context + ". Is it valid JSON?");
          }
        }

        // parse and save as html
        tmpl(context, function(err, html) {
          grunt.file.write(f.dest, html);
          grunt.log.writeln('File "' + f.dest + '" created.');
          done();
        });
      });
    });
  });

  function parseError(err, filePath) {
    grunt.fatal("Error parsing dust template: " + err + " " + filePath);
  }

};
