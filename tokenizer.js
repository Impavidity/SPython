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

    //console.log(this.inputString);
    function getToken() {

    }

    function getNextToken() {
        
    }
}


//lexer = new Lexer("Hello world");
