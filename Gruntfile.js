/*
 * grunt-loopback-auto
 * https://github.com/paulomcnally/grunt-loopback-auto.git
 *
 * Copyright (c) 2014 Paulo McNally
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({

    // Configuration to be run (and then tested).
    'loopback_auto': {
      'default_options': {
        options: {
          dataSource: 'db',
          app: './server/server',
          config: './server/model-config'
        }
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('auto', ['loopback_auto']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['auto']);

};
