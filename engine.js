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
        if (ast.type == "STMT") {
            if (ast.sons.length == 1) {
                if (ast.sons[0].type == "SIMPLE_STMT")
                    _exec_simple_stmt(ast.sons[0], context);
                else if (ast.sons[0].type == "COMPOUND_STMT")
                    _exec_simple_stmt(ast.sons[0], context);
            } else {
                console.log("Length Error");
            }
        }
    }

    function _exec_simple_stmt(ast, context) {
        
    }
    
    function _exec_compound_stmt(ast, context) {
        if (ast.type == "COMPOUND_STMT") {
            if (ast.sons.length == 1) {
                if (ast.sons[0].type == "IF_STMT")
                    _exec_if_stmt(ast.sons[0], context);
                else if (ast.sons[0].type == "WHILE_STMT")
                    _exec_while_stmt(ast.sons[0], context);
                else if (ast.sons[0].type == "FOR_STMT")
                    _exec_for_stmt(ast.sons[0], context);
                else if (ast.sons[0].type == "TRY_STMT")
                    _exec_try_stmt(ast.sons[0], context);
                else if (ast.sons[0].type == "WITH_STMT")
                    _exec_with_stmt(ast.sons[0], context);
                else if (ast.sons[0].type == "FUNCDEF")
                    _exec_funcdef(ast.sons[0], context);
                else if (ast.sons[0].type == "CLASSDEF")
                    _exec_classdef(ast.sons[0], context);
                else if (ast.sons[0].type == "DECORATED")
                    _exec_decorated(ast.sons[0], context);
            }
        }
    }

    function _exec_if_stmt(ast, context) {
        if (ast.type == "IF_STMT") {
            for (var key = 0; key < ast.sons.length; key += 2) {
                if (ast.sons[key].type == "TEST") {
                    if (_exec_test(ast.sons[key], context)) {
                        if (ast.sons[key+1].type == "SUITE") {
                            _exec_suite(ast.sons[key+1], context);
                            break;
                        }
                    }
                }
            }
            if (key == ast.sons.length) {
                if (ast.sons[key].type == "SUITE") {
                    _exec_suite(ast.sons[key], context);
                    break;
                }
            }
        }
    }

    function _exec_while_stmt(ast, context) {
        if (ast.type == "WHILE_STMT" && ast.sons.length == 2) {
            if (ast.sons[0].type == "TEST") {
                while (_exec_test(ast.sons[0], context)) {
                    if (ast.sons[1].type == "SUITE") {
                        _exec_suite(ast.sons[1], context);
                    }
                }
            }
        }
    }
    
}
