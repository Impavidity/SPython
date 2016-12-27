/*
File mode
*/
module.exports = FileMode;

function FileMode(fileName) {
    function checkTree(ast,num) {

        for (var i=0; i<num; i++) {
            process.stdout.write("--");
        }
        console.log(ast.type+"   "+ast.value);
        for (var item in ast.sons) {
            checkTree(ast.sons[item],num+1);
        }
    }
    var fs = require('fs');
    var file = fs.readFileSync(fileName,'utf8');

    var parserClass = require('./parser');
    var parser = new parserClass(file);
    var ast = parser._file_input();
    checkTree(ast,0);
    //console.log(ast);
    
    var ObjectClass = require("./Object");
    var objectClass = new ObjectClass();
    /*
    var engineClass = require("./engine");
    var engine = new engineClass();
    engine._exec_file_input(ast, context);
    */
}
