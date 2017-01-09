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
    var ast = parser._file_input(indent=0);
    //checkTree(ast,0);
    //console.log(ast);
    
    var ObjectClass = require("./Object");
    var context = new ObjectClass.SActiveRecord();
    //console.log(context);

    var engineClass = require("./engine");
    global.engine = new engineClass();
    context.name = "main";
    global.engine._exec_file_input(ast, context);
    
}
