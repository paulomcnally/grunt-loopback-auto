# grunt-loopback-auto

> Grunt plugin for automigrate and autoupdate data sources for LoopBack

## Important
Require Loopback v2.x

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-loopback-auto --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-loopback-auto');
```

## The "loopback_auto" task

### Overview
In your project's Gruntfile, add a section named `loopback_auto` to the data object passed into `grunt.initConfig()`.


#### Default Options


```js
{
  dataSource: 'db', // data source name
  app: './server/server', // path to the application
  config: './server/model-config', // path to the model-config file
  exclude: [], // exclude models ['Users', 'Roles']
  method: 'autoupdate' // or automigrate
}
```

#### Example

```js
module.exports = function(grunt) {
  grunt.initConfig({
    'loopback_auto': {
      'db_autoupdate': {
        options: {
          dataSource: 'db',
          app: './server/server',
          config: './server/model-config',
          method: 'autoupdate'
        }
      },
      'db_automigrate': {
        options: {
          dataSource: 'db',
          app: './server/server',
          config: './server/model-config',
          method: 'automigrate'
        }
      }
    }
  });
  // Load the plugin
  grunt.loadNpmTasks('grunt-loopback-auto');
  grunt.registerTask('default', ['loopback_auto']);
};

```

## Release History

#### 0.0.4

* Fix call done()

#### 0.0.3

* Fix autoincrement counter

#### 0.0.2

* Fix exclude method

#### 0.0.1

* automigrate
* autoupdate

## License
Copyright (c) 2014 Paulo McNally. Licensed under the MIT license.
