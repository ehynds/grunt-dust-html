'use strict';

/*global module:false*/
module.exports = function(grunt) {
  grunt.loadTasks('../tasks');

  grunt.initConfig({
    dusthtml: {
      home: {
        src: 'src/home.dust',
        dest: 'dist/home.html',
        options: {
          partialsDir: 'src/',
          whitespace: true,
          context: {
            title: 'Home Page',
            header: 'Header text',
            footer: 'Footer text'
          }
        }
      }
    }
  });

  grunt.registerTask('default', ['dusthtml']);
};
