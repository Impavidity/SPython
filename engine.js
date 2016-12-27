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
    
    //simle stmt
    function _exec_simple_stmt(ast, context) {
        if (ast.type == "SIMLE_STMT") {
            if (ast.sons.length == 1) {
                if (ast.sons[0].type == "EXPR_STMT")
                    _exec_expr_stmt(ast.sons[0], context);
                else if (ast.sons[0].type == "PRINT_STMT")
                    _exec_print_stmt(ast.sons[0], context);
                else if (ast.sons[0].type == "DEL_STMT")
                    _exec_del_stmt(ast.sons[0], context);
                else if (ast.sons[0].type == "PASS_STMT")
                    _exec_pass_stmt(ast.sons[0], context);
                else if (ast.sons[0].type == "FLOW_STMT")
                    _exec_flow_stmt(ast.sons[0], context);
                else if (ast.sons[0].type == "IMPORT_STMT")
                    _exec_import_stmt(ast.sons[0], context);
                else if (ast.sons[0].type == "GLOBAL_STMT")
                    _exec_global_stmt(ast.sons[0], context);
                else if (ast.sons[0].type == "EXEC_STMT")
                    _exec_exec_stmt(ast.sons[0], context);
                else if (ast.sons[0].type == "ASSERT_STMT")
                    _exec_assert_stmt(ast.sons[0], context);
            }
            else {
                console.log("Simple Stmt Length Error");
            }
        }
    }

    function _exec_expr_stmt(ast, context) {
        if (ast.type == "EXPR_STMT") {
            if (ast.sons.length == 3) {
                for (var key in ast.sons) {
                    if (ast.sons[key].type == "TESTLIST")
                        _exec_testlist(ast.sons[key], context);
                    else if (ast.sons[key].type == "AUGASSIGN")
                        _exec_augassign(ast.sons[key], context);
                    else if (ast_sons[key].type == "=")
                        x = 1;
                }
            }
            else {
                console.log("Expr Stmt Length Error");
            }
        }
    }

    function _exec_augassign(ast, context) {

    }

    function _exec_testlist(ast, context) {
        if (ast.type == "TESTLIST") {
            for (var key in ast.sons) {
                if (ast.sons[key].type == "TEST")
                    _exec_test(ast.sons[key], context);
            }
        }
        return //
    }


    function _exec_test(ast, context) {
        if (ast.type == "TEST") {
            if (ast.sons.length == 1) {
                if (ast.sons[0].type == "OR_TEST")
                    _exec_or_test(ast.sons[0], context);
            }
            else {
                console.log("Test Length Error");
            }
        }
    }

    function _exec_or_test(ast,context) {
        if(ast.type == "OR_TEST"){
            if(ast.sons[0].type == "AND_TEST")
                _exec_and_test(ast.sons[0],context);
           // if(ast.sons.length > 1)
        }

    }

    function _exec_print_stmt(ast,context) {
        if(ast.type == "PRINT_STMT"){
            if(ast.sons.length == 2) {
                if (ast.sons[1].type == "testlist")
                    console.log("print" + _exec_testlist(ast.sons[1], context));
            }
            else {
                console.log("Print_Stmt Length Error");
            }
        }
    }

    function _exec_del_stmt(ast,context) {
        if(ast.type == "DEL_STMT"){
            if(ast.sons.length == 2){
                if(ast.sons[1].type == "EXPRLIST")
                     _exec_exprlist(ast.sons[1],context);
            }
            else {
                console.log("Del_Stmt Length Error");
            }
        }
    }

    function _exec_exprlist(ast,context) {
        if (ast.type == "EXPRLIST") {
            for (var key in ast.sons) {
                if (ast.sons[key].type == "EXPR")
                    _exec_expr(ast.sons[key], context);
            }
        }
        return //
    }

    function _exec_expr(ast,context) {
        if(ast.type == "EXPR"){

        }
    }

    function _exec_pass_stmt(ast,context) {
        if(ast.type == "PASS_STMT"){
            console.log("pass");
        }
    }

    function _exec_flow_stmt(ast,context){
        if(ast.type == "FLOW_STMT"){
            if(ast.sons.length == 1){
                if(ast.sons[0].type =="BREAK_STMT")
                    console.log("break");
                else if(ast.sons[0].type == "CONTINUE_STMT")
                    console.log("continue");
                else if(ast.sons[0].type == "RETURN_STMT")
                    _exec_return_stmt(ast.sons[0],context);
                else if(ast.sons[0].type == "RAISE_STMT")
                    _exec_raise_stmt(ast.sons[0],context);
            }
            else {
                console.log("Flow_Stmt Length Error");
            }
        }
    }
    
}
