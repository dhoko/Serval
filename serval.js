#!/usr/bin/env node

var fs                 = require('fs'),
    path               = require('path'),
    inquirer           = require('inquirer'),
    beautify           = require('js-beautify').js_beautify,
    child              = require('child_process'),
    log                = require('./src/lib/log'),
    makeInstall        = require('./src/lib/makeinstall'),
    listGenerators     = require('./src/lib/generators'),
    success            = log.success,
    info               = log.info,
    error              = log.error;

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

  // Main command to create an app from a generator
  if("make" === command) {

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
        }
      ], function( answers ) {
          makeInstall(answers);
      });
    });

  }


} else {

  console.log();
  info("You can use the following commands :");
  console.log(" > serval make : create an application");
  console.log(" > serval generate : execute a custom generator");
  console.log(" > serval list : List all generators available");
  console.log();
  error("You must specify an option");
}
