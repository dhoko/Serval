#!/usr/bin/env node

var fs             = require('fs'),
    path           = require('path'),
    inquirer       = require('inquirer'),
    beautify       = require('js-beautify').js_beautify,
    child          = require('child_process'),
    log            = require('./src/lib/log'),
    makeInstall    = require('./src/lib/makeinstall'),
    listGenerators = require('./src/lib/generators'),
    success        = log.success,
    info           = log.info,
    error          = log.error;

var current = __filename.split(path.sep);
current.pop();

/**
 * Main Gloups configuration
 *  - module : Directory n-1 where gloups is installed
 *  - src : Your app src directory
 *  - partials : Your app partials directory
 *  - views : Your app views directory
 *  - routes : Your app routes directory
 *  - generator : It will be the your current generator
 */
var SERVAL_CONFIG = {
  module    : current.splice(0,current.indexOf('ser')).join(path.sep) + path.sep,
  src       : path.join(process.cwd(),"src") + path.sep,
  generator : ""
};


if(process.argv.length > 2) {

  // Read the first additional argument passed to the program
  var command = process.argv[2];

  // List all our generators
  if('list' === command) {

    listGenerators(function(generators) {
      success(" > It's done !");
      console.log();
      info("Available generators :");

      generators.forEach(function(generator) {
        console.log(" - " + generator.name);
      });
    });
  }

  // Main command to execute a custom generator
  if('generate' === command) {

    var _args = process.argv;
    if(fs.existsSync('./.serval')) {
      var generator = require(process.cwd() + path.sep + '.serval');
      generator({
        app  : process.cwd() + path.sep,
        args : _args.splice(2),
        dir  : path.resolve('./.serval')  + path.sep
      },{
        beautify : beautify,
        inquirer : inquirer,
        success  : success,
        info     : info,
        error    : error
      });
    }else{
      error('No generators found for this app');
    }
  }

  if("debug" === command) {

    listGenerators(function(generators) {
      success(" > It's done, let's build your app");
      console.log();
      inquirer.prompt([
        {
          type : "input",
          name : "name",
          message : "Name of your app :"
        },
        {
          type : "list",
          name : "generator",
          message : "Choose a generator :",
          choices : generators,
          // type: "checkbox"
        }
      ], function( answers ) {
          console.log(answers)
          makeInstall(answers,SERVAL_CONFIG);
      });
    });
  }

  // Main command to create an app from a generator
  if('make' === command) {

    /**
     * Read inside Gloups install directory/.., it's your global directory.
     * Then we will find each generators for gloups.
     * They must be : gloups-[generator name]
     */
    fs.readdir(path.resolve(SERVAL_CONFIG.module),function(err,files) {

      // Filter each folders and list only generators
      files = files.map(function(file) {
        if(file.toLowerCase().indexOf('serval') > -1) {
          var names = file.split('-');
          if(names.length > 1) {
            names.shift();
            return names.join('-');
          }
        }
      }).filter(function(item) { return item !== undefined;});

      inquirer.prompt([
        {
          type : "input",
          name : "name",
          message : "Name of your app :"
        },
        {
          type : "list",
          name : "generator",
          message : "Choose a generator :",
          choices : files
        }
      ], function( answers ) {
          SERVAL_CONFIG.generator = SERVAL_CONFIG.module + 'serval-' + answers.generator;
          // makeInstall(answers,SERVAL_CONFIG);
      });



    });
  }

} else {

  console.log();
  info("You can use the following commands :");
  console.log(" > serval make : create an application");
  console.log(" > serval generator : execute a custom generator");
  console.log();
  error("You must specify an option");
}
