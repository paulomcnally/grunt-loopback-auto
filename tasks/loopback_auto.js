/*
 * grunt-loopback-auto
 * https://github.com/paulomcnally/grunt-loopback-auto.git
 *
 * Copyright (c) 2014 Paulo McNally
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore');
var path = require('path');

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('loopback_auto', 'Grunt plugin for automigrate and autoupdate data sources for LoopBack', function () {
    var done = this.async();
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      dataSource: 'db',
      app: './server/server',
      config: './server/model-config',
      exclude: [],
      method: 'autoupdate' // or automigrate
    });

    // counter
    var count = 0;

    // check if application exist
    if (!grunt.file.exists(options.app + '.js')) {
      grunt.fail.warn(options.app + ' dont exist.');
    }

    // check if model-config exist
    if (!grunt.file.exists(options.config + '.json')) {
      grunt.fail.warn(options.config + ' dont exist.');
      return false;
    }

    // solved: Don't make functions within a loop
    // http://jslinterrors.com/dont-make-functions-within-a-loop
    function callback(err) {
      if (err) {
        grunt.log.warn(err);
      }
      count++;
      if (count === _.size(config)) {
        done();
      }
    }

    // load application
    var app;
    try {
      app = require(path.resolve(options.app));
      grunt.log.ok('Loaded application %j', options.app);
    } catch (e) {
      var err = new Error('Cannot load application ' + options.app);
      err.origError = e;
      grunt.fail.warn(err);
    }

    // load configuration file
    var config;
    try {
      config = require(path.resolve(options.config));
      grunt.log.ok('Loaded models configuration %j', options.config);
    } catch (e) {
      var err = new Error('Cannot load models configuration ' + options.config);
      err.origError = e;
      grunt.fail.warn(err);
    }

    // run autoupdate for each model
    for (var model in config) {
      // ignore exclude model
      if (!_.contains(options.exclude, model)) {
        if (config[model].dataSource === options.dataSource) {
          var dataSource = app.dataSources[config[model].dataSource];
          dataSource[options.method](model, callback);
          grunt.log.writeln('Processing ' + options.method + ' ' + model);
        }
      }
      else {
        count++;
        grunt.log.writeln('Model ' + model + ' excluded');
      }
    }

  });

};
