module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    watch: {
      files: "<config:lint.files>",
      tasks: "default"
    },
    jshint: {
      files: ["Gruntfile.js", "tasks/**/*.js"],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-nodeunit");
  grunt.registerTask("default", ["jshint"]);
};
