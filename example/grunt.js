/*global module:false*/
module.exports = function(grunt) {
  "use strict";

  grunt.loadTasks("../tasks");

  grunt.initConfig({
    dusthtml: {
      // render home page
      home: {
        src: "src/home.dust",
        dest: "dist/home.html",
        options: {
          basePath: "src/",
          whitespace: true,
          context: {
            title: "Home Page"
          }
        }
      }
    }
  });

  grunt.registerTask("default", "dusthtml");
};
