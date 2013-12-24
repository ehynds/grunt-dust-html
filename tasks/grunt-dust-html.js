/*
 * Grunt Dust-HTML
 * https://github.com/ehynds/grunt-dust-html
 *
 * Copyright (c) 2013 Eric Hynds
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  "use strict";

  var path = require("path"),
      fs   = require("fs"),
      _    = grunt.util._;

  grunt.registerMultiTask("dusthtml", "Render Dust templates against a context to produce HTML", function() {
    var dust,
        done           = this.async(),
        processedFiles = 0,
        self           = this,
        opts           = this.options({
          basePath: ".",
          defaultExt: ".dust",
          whitespace: false,
          module: "dustjs-linkedin", // dust, dustjs-helpers, or dustjs-linkedin
          context: {}
        });

    // Require dust
    try {
      dust = require(opts.module);
    } catch(err) {
      grunt.fail.fatal("Unable to find the " + opts.module + " dependency. Did you npm install it?");
    }

    this.files.forEach(function(f) {
      f.src.forEach(function(srcFile) {
        var context = opts.context = f.context;//opts.context;
        var tmpl;

        // preserve whitespace?
        if(opts.whitespace) {
            dust.optimizers.format = function(ctx, node) {
                return node;
            };
        }
        // Load includes/partials from the filesystem properly
        dust.onLoad = function(filePath, callback) {
          // Make sure the file to load has the proper extension
          if(!path.extname(filePath).length) {
            filePath += opts.defaultExt;
          }

          if(filePath.charAt(0) !== "/") {
            filePath = opts.basePath + "/" + filePath;
            filePath = path.normalize(filePath);
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

        // pre-compile the template
        try {
          tmpl = dust.compileFn(grunt.file.read(srcFile));
        } catch(err) {
          parseError(err, srcFile);
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
          processedFiles++;
          if (processedFiles === self.files.length) {
            done();
          }
        });
      });
    });
  });

  function parseError(err, filePath) {
    grunt.fatal("Error parsing dust template: " + err + " " + filePath);
  }

};
