"use strict";
var fs       = require('fs'),
    path     = require('path'),
    wrench   = require('wrench'),
    child    = require('child_process'),
    log      = require('./log'),
    success  = log.success,
    info     = log.info,
    error    = log.error;
    require('shelljs/global');

/**
 * Build our application, it installs
 *   - node dependencies
 *   - Bower dependencies
 * @return {void}
 */
function buildApp() {

  console.log(' > Install Node dependencies');
  child.exec('npm install --quiet', function(err) {
    error(err);

    console.log(' > Install Bower dependencies');
    child.exec('bower install --quiet && cd ..', function(err) {
      error(err);
      success('Your app is ready');
      console.log();
    });

  });
};

/**
 * It will move your generator to your app directory
 * Then it cleans it's own node_modules
 * @param  {Object} opt App config {name,generator}
 * @return {void}
 */
function replaceApp(opt) {
  console.log(" > Preparing the webapp");
  cp("-r",path.join(process.cwd(),"node_modules",opt.generator,".")+ path.sep + ".", path.join(process.cwd()));
  rm('-rf', "node_modules");
  buildApp();
}

/**
 * Install a generator
 * @param  {Object} opt App config {name,generator}
 * @return {void}
 */
function installNpm(opt) {
  cd(opt.name);
  console.log(' > Install generator : ' + opt.generator);
  child.exec('npm install ' + opt.generator +' --quiet', function(err) {
    error(err);
    replaceApp(opt);
  });
};

/**
 * Create your application from the directory to bower
 * @param  {Object} opt App config {name,generator}
 * @return {void}
 */
function createApp(opt) {
  console.log(" > create a directory " + opt.name);
  fs.mkdirSync(opt.name);
  info("Your webapp directory is ready.");
  console.log();
  console.log(" > Start install");
  installNpm(opt);
};


module.exports = function makeInstall(opt) {
  console.log();
  info('Create your application : ' + opt.name);
  createApp(opt);
};
