module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    jshint: {
      files: ["Gruntfile.js", "tasks/**/*.js", "test/*.js"],
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
    },
    nodeunit: {
      tests: ["test/*_test.js"]
    }
  });
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-nodeunit");
  grunt.registerTask("test", ["nodeunit"]);
  grunt.registerTask("default", ["jshint"]);
};
