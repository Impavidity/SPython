/*
Engine
*/

module.exports = Engine;

function Engine() {

    this._exec_input_file = function(ast, context) {
        if (ast.type == "INPUT_FILE") {
            for (var key in ast.sons) {
                if (ast.sons[key].type == "STMT")
                    _exec_stmt(ast.sons[key], context);
            }
        }
    }

    function _exec_stmt(ast, context) {

    }
}