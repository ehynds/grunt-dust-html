module.exports = function (grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    nodeunit: {
      files: ["test/**/*.js"]
    },
    watch: {
      files: "<config:lint.files>",
      tasks: "default"
    },
    // Configuration to be run (and then tested).
    // Run mocha tests.
    simplemocha: {
      options: {
        globals: ['should'],
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'tap'
      },
      all: {src: ['test/**/*.js'] }
    },
    jshint: {
      files: ["grunt.js", "tasks/**/*.js", "test/**/*.js"],
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
        node: true,
        es5: true,
        "globals": {
          /* MOCHA */
          "describe": false,
          "it": false,
          "before": false,
          "beforeEach": false,
          "after": false,
          "afterEach": false
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-nodeunit");
  grunt.loadNpmTasks('grunt-simple-mocha');

  grunt.registerTask("default", ["jshint"]);
  grunt.registerTask("test", ["simplemocha"]);
};
