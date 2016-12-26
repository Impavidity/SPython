/*
File mode
*/
module.exports = FileMode;

function FileMode(fileName) {
    var fs = require('fs');
    var file = fs.readFileSync(fileName,'utf8');
    var lexerModule = require('./tokenizer');
    var lexer = new lexerModule(file);
}
