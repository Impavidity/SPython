/*
File mode
*/
module.exports = FileMode;

function FileMode(fileName) {
    var fs = require('fs');
    var file = fs.readFileSync(fileName,'utf8');
    var lexerClass = require('./tokenizer');
    var lexer = new lexerClass(file);
}
