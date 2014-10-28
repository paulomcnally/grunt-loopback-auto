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
var colors = require('colors');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('loopback_auto', 'Grunt plugin for automigrate and autoupdate data sources for LoopBack', function () {
    process.env.LOOPBACK_AUTO = true;
    var done = this.async();
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      dataSource: 'db',
      app: './server/server',
      config: './server/model-config',
      exclude: [],
      method: 'autoupdate' // or automigrate
    });

    // counters
    var count = 0;
    var countIgnored = 0;
    var countExcluded = 0;
    var countProcessed = 0;

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
      goToNext();
    }

    // sum counter based type
    function logEvent(type) {
      switch (type) {
        case 'ignored':
          countIgnored++;
        break;
        case 'excluded':
          countExcluded++
        break;
        case 'ok':
          countProcessed++;
        break;
      }
    }

    /**
     * Check if all models has been processed
     */
    function goToNext() {
      count++;
      if (count === _.size(config)) {
        grunt.log.writeln(''); // line break
        grunt.log.ok('Ignored: %d', countIgnored);
        grunt.log.ok('Excluded: %d', countExcluded);
        grunt.log.ok('Processed: %d', countProcessed);
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

    // Show Datasource
    grunt.log.ok('DataSource: %s', colors.blue(options.dataSource));

    // line break
    grunt.log.writeln('');

    // run autoupdate/automigrate for each model
    for (var model in config) {
      // ignore exclude model
      if (!_.contains(options.exclude, model)) {
        if (config[model].dataSource === options.dataSource) {
          var dataSource = app.dataSources[config[model].dataSource];
          // execute command
          logEvent('ok');
          grunt.log.writeln(model + ' ' + colors.green(options.method));
          dataSource[options.method](model, callback);
        }
        else {
          logEvent('ignored');
          grunt.log.writeln(model + ' ' + colors.grey('ignored') + ' -> DataSource: ' + colors.blue(config[model].dataSource));
          goToNext();
        }
      }
      else {
        logEvent('excluded');
        grunt.log.writeln(model + ' ' + colors.yellow('excluded'));
        goToNext();
      }
    }

  });

};
