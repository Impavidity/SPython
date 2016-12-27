/*
Engine : Yuhao, Xuefeng & Peng
*/

module.exports = Engine;

function Engine() {

    var ObjectClass = require("./Object");
    var ResFuncSet = require("./Res");

    /*
    Reviewed
    */
    this._exec_file_input = function(ast, context) {
        if (ast.type == "INPUT_FILE") {
            for (var key in ast.sons) {
                if (ast.sons[key].type == "STMT")
                    _exec_stmt(ast.sons[key], context);
            }
        }
    }

    /*
    Reviewed
    */
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
    
    /*
    Reviewed
    */
    function _exec_compound_stmt(ast, context) {
        if (ast.type == "COMPOUND_STMT") {
            if (ast.sons.length == 1) {
                if (ast.sons[0].type == "IF_STMT")
                    _exec_if_stmt(ast.sons[0], context);
                else if (ast.sons[0].type == "WHILE_STMT")
                    _exec_while_stmt(ast.sons[0], context);
                else if (ast.sons[0].type == "FOR_STMT")
                    _exec_for_stmt(ast.sons[0], context);
                else if (ast.sons[0].type == "FUNCDEF")
                    _exec_funcdef(ast.sons[0], context);
                else if (ast.sons[0].type == "CLASSDEF")
                    _exec_classdef(ast.sons[0], context);
            }
        }
    }
    /*
    Revised by Peng
    Please reflect the Modified part
    */
    function _exec_if_stmt(ast, context) {
        if (ast.type == "IF_STMT") {
            for (var key = 0; key < ast.sons.length; key += 2) {
                if (ast.sons[key].type == "TEST") {
                    if (_exec_test(ast.sons[key], context).value) {
                        if (ast.sons[key+1].type == "SUITE") {
                            _exec_suite(ast.sons[key+1], context);
                            break;
                        }
                    }
                }
            } 
            /*Modified*/
            if (key >= ast.sons.length) {
                var index = ast.sons.length-1;
                if (ast.sons[index].type == "SUITE") {
                    _exec_suite(ast.sons[index], context);
                }
            }
        }
    }

    /*
    Revisied by Peng
    add .value
    need to debug
    */
    function _exec_while_stmt(ast, context) {
        if (ast.type == "WHILE_STMT" && ast.sons.length == 2) {
            if (ast.sons[0].type == "TEST") {
                while (_exec_test(ast.sons[0], context).value) {
                    if (ast.sons[1].type == "SUITE") {
                        _exec_suite(ast.sons[1], context);
                    }
                }
            }
        }
    }
    

    /*
    Reviewed
    */
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

    /*
    Review: Peng
    */
    function _exec_test(ast, context) {
        if (ast.type == "TEST") {
            if (ast.sons.length == 1) {
                if (ast.sons[0].type == "OR_TEST")
                    return _exec_or_test(ast.sons[0], context);
            }
            else {
                console.log("Test Length Error");
            }
        }
    }

    /*
    Revised by : Peng
    */
    function _exec_or_test(ast,context) {
        var result;
        var args = new Array();
        if(ast.type == "OR_TEST"){
            for (var key in ast.sons) {
                if (ast.sons[key].type == "AND_TEST")
                    args.push(_exec_and_test(ast.sons[key], context));
            }
            result = ResFuncSet.RES_or_test(args);
            return result;
        } else {
            console.log("Exec Or Test Error");
        }

    }

    /*
    Revised by : Peng
    */
    function _exec_and_test(ast, context) {
        var result;
        var args = new Array();
        if (ast.type == "AND_TEST") {
            for (var key in ast.sons) {
                if (ast.sons[key].type == "NOT_TEST") {
                    args.push(_exec_not_test(ast.sons[key], context));
                }
            }
            result = ResFuncSet.RES_and_test(args);
            return result;
        }
    }

    /*
    Revised by Peng
    */
    function _exec_not_test(ast, context) {
        var result;
        var args = new Array();
        if (ast.type == "NOT_TEST" && ast.sons.length == 1) {
            if (ast.sons[0].type == "NOT_TEST") {
                result = ResFuncSet.RES_not_test(_exec_not_test(ast.sons[0], context));
                return result;
            } else if (ast.sons[0].type == "COMPARISON") {
                return _exec_comparison(ast.son[0], context));
            }
        }
    }

    /*
    Revised by Peng
    */
    function _exec_comparison(ast,context) {
        var result;
        var args = new Array();
        if(ast.type == "COMPARISON"){
            for(i=0;i<=ast.sons.length;i++) {
               if(ast.sons[i].type == "EXPR")
                   args.push(_exec_expr(ast.sons[i], context));
               else if(ast.sons[i].type == "COMP_OP")
                   args.push(_exec_comp_op(a.sons[i],context));
            }
            result = ResFuncSet.RES_comparison(args);
            return result;
        }
    }

    /*
    written by Peng
    */
    function _exec_comp_op(ast, context) {
        var result = new ObjectClass.SObject();
        result.type = "Option";
        result.value = ast.type;
        return result;
    }




    function _exec_print_stmt(ast,context) {
        if(ast.type == "PRINT_STMT"){
            if(ast.sons.length == 1) {
                if (ast.sons[0].type == "testlist")
                    console.log("print" + _exec_testlist(ast.sons[0], context));
            }
            else {
                console.log("Print_Stmt Length Error");
            }
        }
    }

     function _exec_del_stmt(ast,context) {
        if(ast.type == "DEL_STMT"){
            if(ast.sons.length == 2){
                if(ast.sons[1].type == "EXPRLIST") {
                    var str = _exec_exprlist(ast.sons[1], context);
                    var arr = str.split(",");
                    for(var i=0;i<arr.length;i++){
                        s=Isin_Array(arr[i],context.allEntry);
                        if(s)
                            delete context.allEntry[s];
                    }
                }
            }
            else {
                console.log("Del_Stmt Length Error");
            }
        }
    }

    function Isin_Array(stringToSearch, arrayToSearch) {
        for (s = 0; s < arrayToSearch.length; s++) {
            thisEntry = arrayToSearch[s].toString();
            if (thisEntry == stringToSearch) {
                return s;
            }
        }
        return false;
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

    /*
    Revised by Peng
    */
    function _exec_expr(ast,context) {
        var result;
        var args = new Array();
        if(ast.type == "EXPR"){
            for(var key in ast.sons){
                if(ast.sons[key].type == "XOR_EXPR")
                    args.push(_exec_xor_expr(ast.sons[key],context));
            }
            result = ResFuncSet.RES_expr(args);
            return result;
        }
    }

    /*
    Revised by Peng
    */
    function _exec_xor_expr(ast,context) {
        var result;
        var args = new Array();
        if(ast.type == "XOR_EXPR"){
            for(var key in ast.sons){
                if(ast.sons[key].type == "AND_EXPR")
                    args.push(_exec_and_expr(ast.sons[key],context));
            }
            result = ResFuncSet.RES_xor_expr(arr);
            return result;
        }
    }

    /*
    Revised by Peng
    */
    function _exec_and_expr(ast,context) {
        var result;
        var args = new Array();
        if(ast.type == "AND_EXPR"){
            for(var key in ast.sons){
                if(ast.sons[key].type == "SHIFT_EXPR")
                    args.push(_exec_shift_expr(ast.sons[key],context));
            }
            result = ResFuncSet.RES_and_test(args);
            return result;
        }
    }


    /*
    Revised by Peng
    */
    function _exec_shift_expr(ast,context) {
        var result;
        var args = new Array();
        if(ast.type == "SHIFT_EXPR"){
            for(var key in ast.sons) {
                if (ast.sons[key].type == "ARITH_EXPR")
                    args.push(_exec_arith_expr(ast.sons[key], context));
                else if (ast.sons[key].type == "<<" || ast.sons[key].type == ">>") {
                    var op = new ObjectClass.SObject();
                    op.type = "Option";
                    op.value = ast.sons[key].type;
                    args.push(op);
                }
                    
            }
            result = RES_shift_expr(args);
            return result;
        }
    }

    /*
    Revised by : Peng
    */
    function _exec_arith_expr(ast,context) {
        var result;
        var args = new Array();
        if(ast.type == "ARITH_EXPR"){
            for(var key in ast.sons){
                if(ast.sons[key].type == "TERM")
                    args.push(_exec_term(ast.sons[key],context));
                else if (ast.sons[key].type == '+' || ast.sons[key].type == '-') {
                    var op = new ObjectClass.SObject();
                    op.type = "Option";
                    op.value = ast.sons[key].type;
                    args.push(op);
                }
            }
            result = ResFuncSet.RES_arith_expr(args);
            return result;
        }
    }

    /*
    Revised by Peng
    */
    function _exec_term(ast,context) {
        var result;
        var args = new Array();
        if(ast.type == "TERM"){
            for(var key in ast.sons){
                if(ast.sons[key].type == "FACTOR")
                    args.push(_exec_factor(ast.sons[key],context));
            }
            result = ResFuncSet.RES_term(args);
            return result;
        }
    }
    
    /*
    Revised by Peng
    */
    function _exec_factor(ast,context) {
        var result;
        var args = new Array();
        if(ast.type == "FACTOR"){
            for (var key in ast.sons) {
                if (ast.sons[key].type == "FACTOR") {
                    args.push(_exec_factor(ast.sons[key], context));
                } else if (ast.sons[key].type == "+" || 
                    ast.sons[key].type == "-" || ast.sons[key].type == "~") {
                    var op = new ObjectClass.SObject();
                    op.type = "Option";
                    op.value = ast.sons[key].type;
                    args.push(op);
                } else if (ast.sons[key].type == "POWER") {
                    args.push(_exec_power(ast.sons[key], context));
                }
            }
            result = RES_factor(arr);
            return result;
        }
    }
    
    function _exec_atom(ast,context) {
        if(ast.type == "ATOM"){
            // list tuple 这一块不会
            var atom = new SObject();
            if(ast.sons.length == 1) {
                    atom.type = ast.sons[0].type;
                    atom.value = ast.sons[0].value;
            }
            return atom;
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
