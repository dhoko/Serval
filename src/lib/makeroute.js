"use strict";

var fs       = require('fs'),
    log      = require('./log'),
    success  = log.success,
    info     = log.info,
    error    = log.error;

var makeroute = function makeroute(viewName, config) {

  try{
    var myFile  = config.GENERATOR + 'backbone/route/route.js',
        content = fs.readFileSync(myFile, 'utf8'),
        tpl     = {
          lower : viewName.toLowerCase(),
          capitalize : viewName,
        },
        originalRoutes = config.ROUTES + 'router.js',
        oldContent     = fs.readFileSync(originalRoutes,'utf8');

    content = content.replace(/==viewLower==/g,tpl.lower)
          .replace(/==viewCapitalize==/g,tpl.capitalize);

    oldContent = oldContent.replace(/\/\/=route=\/\//,content)
            .replace(/'home': 'home'/,"\t\t'home': 'home' \n '"+tpl.lower+"': '"+tpl.lower+"'");

    fs.writeFileSync(originalRoutes, oldContent);

    success('The view ' + viewName + ' has a route now it is /#' + tpl.lower);

  }catch(e) {
    error(e);
  }
};

module.exports = makeroute;