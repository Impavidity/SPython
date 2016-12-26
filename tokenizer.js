/*
The ad-hoc tokenizer for SPython
*/
module.exports = Lexer;
function Lexer(inputString) {
    //The Lexer class
    if (inputString == undefined) {
        console.log("Empty input file");
        return;
    } else {
        this.inputString = inputString;
    }
    this.pointer = 0;
    //console.log(this.inputString);
    function getLastChar() {
        if (this.pointer<this.inputString.length())
            return this.inputString[this.pointer++];
        else return "EOF"
    }
    function getToken() {
        var identifierStr;
        var numStr;
        var lastChar=' ';
        while (isspace(lastChar)) {
            lastChar = getLastChar();
        }
        if (isalpha(lastChar)) {
            identifierStr = lastChar;
            while (isalnum(lastChar=getLastChar()))
                identifierStr += lastChar;

            if (identifierStr == "def") return "def";
            if (identifierStr == "print") return "print";
            return "tok";
        }

        if (isdigit(lastChar)) {
            //Cannot support .91 => 0.91
            do {
                numStr += lastChar;
                lastChar = getLastChar();
            } while (isdigit(lastChar) || lastChar == '.')

            return 'num';
        }

        if (lastChar == "#") {
            do lastChar = getLastChar();
            while (lastChar != '\n' && lastChar != '\r');
            if (lastChar != "EOF") return getToken();
        }
    }

}


//lexer = new Lexer("Hello world");
