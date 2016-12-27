/*
The ad-hoc tokenizer for SPython
*/
module.exports = Lexer;
function Lexer(inputFile) {
    //The Lexer class
    var inputString = inputFile;
    var pointer = 0;
    
    var oplist = ['+','-','*','/','%','=','&','|','^','<','>'];
    var treeNodeClass = require('./treeNode');
    var lineNum = 1;
    var lastChar=' ';

    function getLastChar() {
        if (pointer<inputString.length)
            return inputString[pointer++];
        else return "EOF"
    }

    function isalpha(ch) {
        if (ch == "EOF") return false;
        if ((ch>='a' && ch<='z') || (ch>='A' && ch<='Z')) return true;
        else return false;
    }

    function isnum(ch) {
        if (ch>='0' && ch<='9')return true;
        else return false;
    }

    function isdigit(ch) {
        if (isnum(ch) || (ch == '.')) return true;
        else return false;
    }

    function isalnum(ch) {
        if (isalpha(ch) || isnum(ch) || ch == '_') return true;
        else return false;
    }

    function isspace(ch) {
        if (ch==' ') return true;
        return false;
    }

    function isop(ch) {
        if (oplist.indexOf(ch)!=-1) return true;
        else return false;
    }

    function isnewline(ch) {
        if (ch=='\n') {
            lineNum += 1;
            return true;
        } else return false;
    }

    function isindent(ch) {
        if (ch=='\t') {
            return true;
        } else return false;
    }

    this.getToken = function() {
        var identifierStr; // identifier: [a-zA-Z][a-zA-Z0-9]*
        var numStr;
        var opStr;
        var treeNode = new treeNodeClass();

        while (isspace(lastChar)) {
            lastChar = getLastChar();
        }
        while (isnewline(lastChar)) {
            treeNode.type = 'NEWLINE';
            treeNode.lineNumber = lineNum;
            lastChar = getLastChar();
            return treeNode;
        }

        while (isindent(lastChar)) {
            treeNode.type = "INDENT";
            treeNode.lineNumber = lineNum;
            lastChar = getLastChar();
            return treeNode;
        }
        //console.log("After space");
        if (lastChar == "EOF") {
            treeNode.type = "EOF";
            return treeNode;
        }
        // console.log("After EOF");

        //Dirty work
        if (lastChar == ',' || lastChar == ':') {
            treeNode.type = lastChar;
            treeNode.lineNumber = lineNum;
            lastChar = getLastChar();
            return treeNode;
        }
        //console.log("After ,");


        if (isalpha(lastChar)) {
            identifierStr = lastChar;
            while (isalnum(lastChar=getLastChar()))
                identifierStr += lastChar;
            treeNode.type = "NAME";
            treeNode.value = identifierStr;
            treeNode.lineNumber = lineNum;
            if (identifierStr == "if") treeNode.type = "IF";
            if (identifierStr == "print") treeNode.type = "PRINT";
            if (identifierStr == "del") treeNode.type = "DEL";
            if (identifierStr == "while") treeNode.type = "WHILE";
            if (identifierStr == "in") treeNode.type = "IN";
            if (identifierStr == "not") treeNode.type = "NOT";
            if (identifierStr == "is") treeNode.type = "IS";
            if (identifierStr == "elif") treeNode.type = "ELIF";
            if (identifierStr == "else") treeNode.type = "ELSE";
            return treeNode;

        }
        // console.log("After alpha");

        if (isdigit(lastChar)) {
            //Cannot support .91 => 0.91
            numStr = "";
            do {
                numStr += lastChar;
                lastChar = getLastChar();
            } while (isdigit(lastChar) || lastChar == '.');

            treeNode.type = 'NUMBER';
            treeNode.value = numStr;
            treeNode.lineNumber = lineNum;
            return treeNode;
        }

        // console.log("After digit");
        if (lastChar == "#") {
            do lastChar = getLastChar();
            while (lastChar != '\n' && lastChar != '\r');
            if (lastChar != "EOF") return getToken();
        }

        // console.log("After comment");
        
        if (isop(lastChar)) {
            opStr = lastChar;
            while (isop(lastChar=getLastChar())) {
                opStr += lastChar;   
            }

            treeNode.type = opStr;
            treeNode.value = opStr;
            treeNode.lineNumber = lineNum;
            return treeNode;
        }

        // console.log("After op");
        
    }

}


//lexer = new Lexer("Hello world");
