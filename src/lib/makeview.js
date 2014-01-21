"use strict";

var fs       = require('fs'),
    log      = require('./log'),
    success  = log.success,
    info     = log.info,
    error    = log.error;

var makeview = function makeview(viewName, config) {

  try{
    var myFile  = config.GENERATOR + 'backbone/view/view.js',
        content = fs.readFileSync(myFile, 'utf8'),
        tpl     = {
          lower : viewName.toLowerCase(),
          capitalize : viewName,
        };

    content = content.replace(/==viewLower==/g,tpl.lower)
          .replace(/==viewCapitalize==/g,tpl.capitalize);

    fs.writeFileSync(config.VIEWS + viewName + '.js', content);
    success('The view ' + viewName + ' is created');
  }catch(e) {
    error(e);
  }
};

module.exports = makeview;