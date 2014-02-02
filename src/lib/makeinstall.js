"use strict";
var fs       = require('fs'),
    path     = require('path'),
    wrench   = require('wrench'),
    child    = require('child_process'),
    log      = require('./log'),
    success  = log.success,
    info     = log.info,
    error    = log.error;

var installPackages = function installPackages(folder) {

  console.log('Install Node dependencies');
  child.exec('npm --prefix ./' + folder +' install ./' + folder +' --quiet', function(err) {
    error(err);

    console.log('Install Bower dependencies');
    child.exec('cd ./' + folder + ' && bower install --quiet && cd ..', function(err) {
      error(err);
      success('Your app is ready');
    });
  });
};

module.exports = function makeInstall(opt, config) {

  info('Create your application : ' + opt.name);

  if(!fs.existsSync('./' + opt.name)){
    fs.mkdir(opt.name,error);
  }

  wrench.copyDirRecursive(config.GENERATOR + opt.generator + '/base', './' + opt.name, {
    excludeHiddenUnix : false,
    forceDelete : true,
    preserveFiles:true
  }, function(err) {
    error(err);
    installPackages(opt.name);

  });
};