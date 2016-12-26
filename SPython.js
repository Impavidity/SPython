/*
Main function for SPython
How to Use:
Command line mode : node SPython.js
File mode : node Spython.js foo.py
*/

var arguments = process.argv
var fileModeClass = require("./fileMode");
if (arguments.length == 2) {
    console.log("InterativeMode");
    //InterativeMode();
} else
if (arguments.length == 3) {
    console.log("FileMode");
    //console.log(arguments[2]);
    var fileMode = new fileModeClass(arguments[2]);
} else {
    console.log("Arguments Error!");
    return;
}
