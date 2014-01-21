"use strict"
var fs = require('fs');

if(process.argv.length > 2) {
    // Read the first additional argument passed to the program
    var myfile = process.argv[2];

    if(fs.existsSync(myfile)) {
        var content = fs.readFileSync(myfile, 'utf8');
        fs.writeFileSync(myfile, content.toLowerCase());
        console.log("Done");
    } else {
        console.log("File does not exist - " + myfile);
    }
} else {
    console.error("ERROR: Pass on a file name/path");
}