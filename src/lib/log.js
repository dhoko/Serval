"use strict";

var clc = require('cli-color');

module.exports = {
    error : function error(err) {
      if(err) {
        console.log(clc.red(err));
        process.exit(0);
      }
    },
    success : function success(msg) {
      console.log(clc.green(msg));
    },
    info : function info(msg) {
      console.log(clc.cyan(msg));
    }
};
