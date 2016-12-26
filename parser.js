/*
Parser
*/

module.exports = Parser;


function Parser() {
    var lexerClass = require('./tokenizer');
    this.lexer = new lexerClass(file);
    this.currentToken = lexer.getToken();
    
    function _match(type) {
        if (this.currentToken.type == type) {
            val = this.currentToken.val;
            this.currentToken = lexer.getToken();
            return val; 
        }
    }

    function _stmt() {
        if (currentToken.type == "PRINT"):
            return this._print_stmt();
        else 
            return this._expr_stmt();
    }

    function _expr_stmt() {
        id_name = this._match('IDENTIFIER');

    }

}

var treeNodeClass = require('./treeNode');
var treeNode = new treeNodeClass();

treeNode.value = 1;
treeNode.type = "number";
treeNode.lineNumber = 1;

console.log(treeNode.lineNumber);

