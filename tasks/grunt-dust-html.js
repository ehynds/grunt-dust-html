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
  var _ = grunt.util._;

  grunt.registerMultiTask("dusthtml", "Render Dust templates against a context to produce HTML", function() {
    var dust;

    // find me some dust
    try {
      dust = require("dust");
    } catch(err) {
      try {
        // use the linkedin version with helpers if available
        dust = require("dustjs-helpers"); 
      } catch(err) {
        dust = require("dustjs-linkedin");
      }
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
        var context = opts.context;
        var tmpl;

        // pre-compile the template
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

        // if context is a string assume it's the location to a file
        if(typeof opts.context === "string") {
          context = grunt.file.readJSON(opts.context);

        // if context is an array merge each item together
        } else if(Array.isArray(opts.context)) {
          context = {};

          opts.context.forEach(function(obj) {
            if(typeof obj === "string") {
              obj = grunt.file.readJSON(obj);
            }

            _.extend(context, obj);
          });
        }

        // render template and save as html
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
