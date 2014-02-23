"use strict";
var log      = require('./log'),
    request  = require('request'),
    success  = log.success,
    info     = log.info,
    error    = log.error;

/**
 * List all of our generators from NPM thanks to a tag
 * To be listed you must add "serval-generator" in your tags.
 * @param  {Function} cb Callback trigger when we find them
 * @return {void}
 */
module.exports = function listGenerators(cb) {

  var url = "http://isaacs.iriscouch.com/registry/_design/app/_view/byKeyword?startkey=[%22serval-generator%22]&endkey=[%22serval-generator%22,{}]&group_level=3",
    generators = [];
  console.log();
  info(" > Try to find our generators from NPM...");

  request(url, function (err, response, body) {
    error(err);

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
