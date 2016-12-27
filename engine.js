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
    
    function _exec_test(ast, context) {
        if (ast.type == "TEST" && ast.sons.length == 1) {
            if (ast.sons[0].type == "OR_TEST") {
                return _exec_or_test(ast.sons[0], context);
            }
        }
    }

    function _exec_or_test(ast, context) {
        if (ast.type == "OR_TEST" && ast.sons.length >= 1) {
            if (ast.sons[0].type == "AND_TEST") {
                var result = _exec_and_test(ast.sons[0], context);
                for (var key = 1; key < ast.sons.length; key++) {
                    if (ast.sons[key].type == "AND_TEST") {
                        result = result || _exec_and_test(ast.sons[key], context);
                    }
                }
                return result;
            }
        }
    }

    function _exec_and_test(ast, context) {
        if (ast.type == "AND_TEST" && ast.sons.length >= 1) {
            if (ast.sons[0].type == "NOT_TEST") {
                var result = _exec_not_test(ast.sons[0], context);
                for (var key = 1; key < ast.sons.length; key++) {
                    if (ast.sons[key].type == "NOT_TEST") {
                        result = result && _exec_not_test(ast.sons[key], context);
                    }
                }
                return result;
            }
        }
    }

    function _exec_not_test(ast, context) {
        if (ast.type == "NOT_TEST" && ast.sons.length == 1) {
            if (ast.sons[0].type == "NOT_TEST") {
                return !_exec_not_test(ast.sons[0], context);
            } else if (ast.sons[0].type == "COMPARISON") {
                return _exec_comparison(ast.son[0], context);
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

   function _exec_expr(ast,context) {
        if(ast.type == "EXPR"){
            var expr = new SObject();                       //对象创建方法有疑问
            var arr = new Array();
            for(var key in ast.sons){
                if(ast.sons[key].type == "XOR_EXPR")
                    arr.push(_exec_xor_expr(ast.sons[key],context));
            }
            expr = RES_comparison(arr);
            return expr;
        }
    }

    function _exec_xor_expr(ast,context) {
        if(ast.type == "XOR_EXPR"){
            var xor_expr = new SObject();
            var arr = new Array();
            for(var key in ast.sons){
                if(ast.sons[key] == "AND_EXPR")
                    arr.push(_exec_and_expr(ast.sons[key],context));
            }
            xor_expr = RES_comparison(arr);
            return xor_expr;
        }
    }

    function _exec_and_expr(ast,context) {
        if(ast.type == "AND_EXPR"){
            var and_expr = new SObject();
            var arr = new Array();
            for(var key in ast.sons){
                if(ast.sons[key] == "SHIFT_EXPR")
                    arr.push(_exec_shift_expr(ast.sons[key],context));
            }
            and_expr = RES_comparison(arr);
            return and_expr;
        }
    }

    function _exec_shift_expr(ast,context) {
        if(ast.type == "SHIFT_EXPR"){
            var shift_expr = new SObject();
            var arr = new Array();
            for(var key in ast.sons) {
                if (ast.sons[key] == "ARITH_EXPR")
                    arr.push(_exec_arith_expr(ast.sons[key], context));
            }
            shift_expr = RES_comparison(arr);
            return shift_expr;
        }
    }

    function _exec_arith_expr(ast,context) {
        if(ast.type == "ARITH_EXPR"){
            var arith_expr = new  SObject();
            var arr = new Array();
            for(var key in ast.sons){
                if(ast.sons[key] == "TERM")
                    arr.push(_exec_term(ast.sons[key],context));
            }
            arith_expr = RES_comparison(arr);
            return arith_expr;
        }
    }

    function _exec_term(ast,context) {
        if(ast.type == "TERM"){
            var term = new SObject();
            var arr = new Array();
            for(var key in ast.sons){
                if(ast.sons[key] == "FACTOR")
                    arr.push(_exec_factor(ast.sons[key],context));
            }
            term = RES_comparison(arr);
            return term;
        }
    }
    
    function _exec_factor(ast,context) {
        if(ast.type == "FACTOR"){
            var factor = new SObject();
            var arr = new Array();
            if(ast.sons.length == 1)
                arr.push(_exec_power(ast.sons[0],context));
            else if(ast.sons.length == 2){
                arr.push(ast.sons[0],context);
                _exec_factor(ast.sons[1],context);
            }
            factor = RES_comparison(arr);
            return factor;
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
    
    function _exec_comparison(ast,context) {
        if(ast.type == "COMPARISON"){
            arr = new array();
            for(i=0;i<=ast.sons.length;i++) {
               if(ast.sons[i].type == "EXPR")
                   arr.push(_exec_expr(ast.sons[i], context));
               else if(ast.sons[i].type == "COMP_ON")
                   arr.push(_exec_comp_on(a.sons[i],context));
            }
            return arr;
        }
    }
}
