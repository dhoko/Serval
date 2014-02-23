"use strict";
var fs       = require('fs'),
    path     = require('path'),
    wrench   = require('wrench'),
    child    = require('child_process'),
    log      = require('./log'),
    request  = require('request'),
    success  = log.success,
    info     = log.info,
    error    = log.error;


module.exports = function listGenerators(cb) {

  var url = "http://isaacs.iriscouch.com/registry/_design/app/_view/byKeyword?startkey=[%22serval-generator%22]&endkey=[%22serval-generator%22,{}]&group_level=3",
    generators = [];
  console.log();
  info(" > Try to find our generators from NPM...");

  request(url, function (err, response, body) {

    if(err) {
      error(error);
    }

    if (200 == response.statusCode) {
      var rep = JSON.parse(body);

      rep.rows.forEach(function(item) {
        generators.push({
          name : item.key[1] + " - " + item.key[2],
          value : item.key[1]
        });
      });
      cb(generators);
    }
  });
};