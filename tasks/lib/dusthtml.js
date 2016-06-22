'use strict';

var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var grunt = require('grunt');

module.exports.render = function(input, opts, callback) {
  // shift args
  if(arguments.length === 2) {
    callback = opts;
    opts = {};
  }

  opts = _.extend({
    partialsDir: '.',
    defaultExt: '.dust',
    whitespace: false,
    cache: true,
    module: 'dustjs-linkedin', // dust, dustjs-helpers, or dustjs-linkedin
    context: {}
  }, opts || {});

  var dust = require(opts.module);
  var context = opts.context;
  var tmpl;

  // Configure dust to load partials from the paths defined
  // in the `partialsDir` option
  dust.onLoad = function(filePath, loadCallback) {
    // Make sure the file to load has the proper extension
    if(!path.extname(filePath).length) {
      filePath += opts.defaultExt;
    }

    // If we're dealing with relative paths..
    if(filePath.charAt(0) !== '/') {
      // Only joins the paths if "string"
      if(typeof opts.partialsDir === 'string') {
        filePath = path.join(opts.partialsDir, filePath);

      // Checks whether the "partialsDir" option is an Array and returns the first folder that contains the file.
      } else if(Array.isArray(opts.partialsDir)) {
        for(var i = 0; i < opts.partialsDir.length; i++) {
          if(grunt.file.isFile(path.join(opts.partialsDir[i], filePath))) {
            filePath = path.join(opts.partialsDir[i], filePath);
            break;
          }
        }
      }
    }

    fs.readFile(filePath, 'utf8', function(err, html) {
      if(err) {
        return callback(new Error('Cannot find partial ' + filePath));
      }

      loadCallback(null, html);
    });
  };

  // Preserve whitespace?
  if(opts.whitespace) {
    dust.optimizers.format = function(ctx, node) {
      return node;
    };
  }

  // turn off dust caching templates and partials.
  // caching should be turned off if you want use grunt-dust-html with watchers
  dust.config.cache = opts.cache;

  // Pre-compile the template
  try {
    tmpl = dust.compileFn(input);
  } catch(err) {
    callback(err);
  }

  // If the context option is a string, assume it's a file and read it as JSON
  if(typeof opts.context === 'string') {
    context = grunt.file.readJSON(opts.context);

  // If context is an array merge each item together
  } else if(Array.isArray(opts.context)) {
    context = {};
    opts.context.forEach(function(obj) {
      if(typeof obj === 'string') {
        obj = grunt.file.readJSON(obj);
      }

      _.extend(context, obj);
    });
  }

  // Render the template and pass the result directly to the callback
  tmpl(context, callback);
};
