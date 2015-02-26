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
      if (count === _.size(models)) {
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

    var ds = app.dataSources[options.dataSource];
    ds.setMaxListeners(100); //squash warning, not sure if this is harmful

    // Show Datasource
    grunt.log.ok('DataSource: %s', colors.blue(ds.name));

    // line break
    grunt.log.writeln('');

    //collect models for data source.
    var models = _.select(ds.modelBuilder.models, function(model) {
      return (model.dataSource === ds);
    });

    models.forEach(function(model, idx, list) {
      if (_.contains(options.exclude, model.modelName)) {
        logEvent('ignored');
        grunt.log.writeln('Ignored ' + colors.grey(model.modelName));
      }
      else {
        logEvent('ok');

        grunt.log.writeln(options.method + ' applied to' + ' ' + colors.green(model.modelName));
        ds[options.method](model.modelName, callback);
      }
    });
  });
};

