/*
Engine : Yuhao, Xuefeng & Peng
*/

module.exports = Engine;

function Engine() {

    var ObjectClass = require("./Object");
    var ResFuncSet = require("./Res");
    var _DEGUG = false;
    /*
    Reviewed
    */
    this._exec_file_input = function(ast, context, debug=_DEGUG) {
        if (ast.type == "FILE_INPUT") {
            for (var key in ast.sons) {
                if (ast.sons[key].type == "STMT")
                    _exec_stmt(ast.sons[key], context);
            }
        }
        console.log(context.printEntry());
    }

    /*
    Written by Peng Function Implementation
    */
    function _exec_funcdef(ast, context, debug=_DEGUG) {
        var FRecord = new ObjectClass.SFunction();
        var funcName = "";
        for (var item in ast.sons) {
            if (ast.sons[item].type == "NAME"){
                funcName = ast.sons[item].value;
                FRecord.name = funcName;
                FRecord.ast = ast;
            }
            if (ast.sons[item].type == "PARAMETERS") {
                FRecord.argument = _exec_parameters(ast.sons[item],context);
            }
        }
        var func = new ObjectClass.SObject();
        func.type = "FUNC";
        func.value = FRecord;
        func.name = funcName;
        context.allEntry[funcName] = func;
    }

    function _exec_parameters(ast,context, debug=_DEGUG){
        if (ast.sons[0].type == "VARARGSLIST") {
            return _exec_varargslist(ast.sons[0], context);
        }
    }

    function _exec_varargslist(ast, context, debug=_DEGUG) {
        var args = new Array();
        for (var item in ast.sons) {
            if (ast.sons[item].type == "FPDEF") {
                args.push(_exec_fpdef(ast.sons[item]));
            }
            if (ast.sons[item].type == "=" || ast.sons[item].type == "*" || ast.sons[item].type == "**") {
                var op = new ObjectClass.SObject();
                op.type = "Option";
                op.value = ast.sons[item].type;
                args.push(op);
            }
            if (ast.sons[item].type == "TEST") {
                args.push(_exec_test(ast.sons[item]));
            }
            if (ast.sons[item].type == "NAME") {
                var name = new ObjectClass.SObject();
                name.name = ast.sons[item].value;
                name.type = "Identity";
                args.push(name);
            }
        }
        return args;
    }

    function _exec_fpdef(ast, context, debug=_DEGUG) {
        var fp = ObjectClass.SObject();
        if (ast.sons[0]=="NAME") {
            fp.name = ast.sons[0].value;
            fp.type = "Identity";
        }
        if (ast.sons[0]== "FPLIST") {
            return -1;
        }
        return fp;
    }

    function _exec_classdef(ast, context, debug=_DEGUG) {
        
    }

    /*
    Reviewed
    */
    function _exec_stmt(ast, context, debug=_DEGUG) {
        if (debug) console.log(ast);
        if (ast.type == "STMT") {
            if (ast.sons.length == 1) {
                if (ast.sons[0].type == "SIMPLE_STMT")
                    _exec_simple_stmt(ast.sons[0], context);
                else if (ast.sons[0].type == "COMPOUND_STMT")
                    _exec_compound_stmt(ast.sons[0], context);
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
    function _exec_simple_stmt(ast, context, debug=_DEGUG) {
        if (debug) console.log(ast);
        debug = true;
        if (debug) {console.log("|||CONTEXT LENGTH|||");console.log(context.getEntryLength());console.log("||||||");}
        if (ast.type == "SIMPLE_STMT") {
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

    /*
    Revised by Peng
    */
    function _exec_expr_stmt(ast, context, debug=_DEGUG) {
        debug = true;
        if (debug) {console.log("|||CONTEXT LENGTH|||");console.log(context.getEntryLength());console.log("||||||");}
        if (debug) {console.log("EXPR STMT AST #####");console.log(ast);console.log("#####");}
        var args = new Array();
        var result;
        if (ast.type == "EXPR_STMT") {
            if (ast.sons.length == 3) {
                for (var key in ast.sons) {
                    if (ast.sons[key].type == "TESTLIST") {
                        args.push(_exec_testlist(ast.sons[key], context));
                    } else if (ast.sons[key].type == "AUGASSIGN") {
                        args.push(_exec_augassign(ast.sons[key], context));
                    } else if (ast.sons[key].type == "=") {
                        var op = new ObjectClass.SObject();
                        op.type = "Option";
                        op.value = ast.sons[key].type;
                        args.push(op);
                    } else {
                        console.log("Can not find type "+ast.sons[key].type);
                    }
                }
                if (debug) {console.log("EXPR STMT Args #####"); console.log(args); console.log("#####") }
                if (debug) {console.log("|||CONTEXT LENGTH Before|||");console.log(context.getEntryLength());console.log("||||||");}
                result = ResFuncSet.RES_expr_stmt(args[0],args[1],args[2],context);
                if (debug) {console.log("|||CONTEXT LENGTH After|||");console.log(context.getEntryLength());console.log("||||||");}
                if (debug) {console.log(context.printEntry());}
                return result;
            }
            else {
                console.log("Expr Stmt Length Error");
            }
        }
    }

    /*
    Revised by Peng
    */
    function _exec_augassign(ast, context) {
        var result = new ObjectClass.SObject();
        result.value = ast.value;
        result.type = "Option";
        return result;
    }

    /*
    Revised by Peng : unfinished
    */
    function _exec_testlist(ast, context, debug=_DEGUG) {
        debug = true;
        if (debug) {console.log("TESTLIST AST #####");console.log(ast);console.log("#####");}
        var args = new Array();
        var result;
        if (ast.type == "TESTLIST") {
            for (var key in ast.sons) {
                if (ast.sons[key].type == "TEST")
                    args.push(_exec_test(ast.sons[key], context));
            }
        }
        if (debug) {console.log("TESTLIST Args #####");console.log(args);console.log("#####");}
        result = /*Make Struct*/(args);
        return result;
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
    function _exec_and_test(ast, context, debug=_DEGUG) {
        debug = true;
        var result;
        var args = new Array();
        if (ast.type == "AND_TEST") {
            for (var key in ast.sons) {
                if (ast.sons[key].type == "NOT_TEST") {
                    args.push(_exec_not_test(ast.sons[key], context));
                }
            }
            if (debug) {console.log("AND TEST Args #####");console.log(args);console.log("#####");}
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
                return _exec_comparison(ast.sons[0], context);
            }
        }
    }

    /*
    Revised by Peng : ERROR!!!!! Not Boolean here!!!
    */
    function _exec_comparison(ast,context,debug=_DEGUG) {
        debug = true;
        var result;
        var args = new Array();
        if (debug) {console.log("COMPARISON AST TREE #####");console.log(ast);console.log("#####");}
        if(ast.type == "COMPARISON"){
            for(i=0;i<ast.sons.length;i++) {
                if(ast.sons[i].type == "EXPR")
                   args.push(_exec_expr(ast.sons[i], context));
                else if(ast.sons[i].type == "COMP_OP")
                   args.push(_exec_comp_op(a.sons[i],context));
            }
            if (debug) {console.log("COMPARISON Args #####");console.log(args);console.log("#####");}
            result = ResFuncSet.RES_comparison(args);
            if (debug) {console.log("COMPARISON Result #####");console.log(result);console.log("#####");}
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



    /*
    Revised by Peng: unfinished
    */
    function _exec_print_stmt(ast,context,debug=_DEGUG) {
        if (debug) console.log(ast);
        var result;
        if(ast.type == "PRINT_STMT"){
            if(ast.sons.length == 1) {
                if (ast.sons[0].type == "TESTLIST") {
                    result = _exec_testlist(ast.sons[0], context);
                    /*PRINT*/(result);
                }
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
                        // Peng : Need to be modified
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
    function _exec_expr(ast,context,debug=_DEGUG) {
        debug = true;
        var result;
        var args = new Array();
        if(ast.type == "EXPR"){
            for(var key in ast.sons){
                if(ast.sons[key].type == "XOR_EXPR")
                    args.push(_exec_xor_expr(ast.sons[key],context));
            }
            result = ResFuncSet.RES_expr(args);
            if (debug) {console.log("EXPR Result #####");console.log(result);console.log("#####");}
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
            result = ResFuncSet.RES_xor_expr(args);
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
            result = ResFuncSet.RES_and_expr(args);
            return result;
        }
    }


    /*
    Revised by Peng
    */
    function _exec_shift_expr(ast,context,debug=_DEGUG) {
        debug = true;
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
            result = ResFuncSet.RES_shift_expr(args);
            if (debug) {console.log("SHIFT EXPR #####");console.log(result);console.log("#####");}
            return result;
        }
    }

    /*
    Revised by : Peng
    */
    function _exec_arith_expr(ast,context,debug=_DEGUG) {
        debug = true;
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
            if (debug) {console.log("ARITH Arguments #####");console.log(args);console.log("#####");}
            result = ResFuncSet.RES_arith_expr(args);
            if (debug) {console.log("ARITH EXPR Result #####");console.log(result);console.log("#####");}
            return result;
        }
    }

    /*
    Revised by Peng
    */
    function _exec_term(ast,context,debug=_DEGUG) {
        debug = true;
        var result;
        var args = new Array();
        if(ast.type == "TERM"){
            for(var key in ast.sons){
                if(ast.sons[key].type == "FACTOR") {
                    args.push(_exec_factor(ast.sons[key],context));
                }
                else if (ast.sons[key].type=="*" || ast.sons[key].type=="/" ||
                    ast.sons[key].type=="%" || ast.sons[key].type=="//") {
                    var op = new ObjectClass.SObject();
                    op.type = "Option";
                    op.value = ast.sons[key].type;
                    args.push(op);
                }
            }
            if (debug) {console.log("TERM Arguments #####");console.log(args);console.log("#####");}
            result = ResFuncSet.RES_term(args);
            if (debug) {console.log("TERM Result #####");console.log(result);console.log("#####");}
            return result;
        }
    }
    
    /*
    Revised by Peng
    */
    function _exec_factor(ast,context,debug=_DEGUG) {
        debug = true;
        if (debug) {console.log("FACTOR AST #####"); console.log(ast);console.log("#####");}
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
            if (debug) {console.log("FACTOR Args #####");console.log(args);console.log("#####")}
            result = ResFuncSet.RES_factor(args);
            if (debug) {console.log("FACTOR Result #####");console.log(result);console.log("#####");}
            return result;
        }
    }


    /*
    Written by Peng : Unfinished
    */
    function _exec_power(ast, context) {
        var result;
        var args = new Array();
        if (ast.type == "POWER") {
            for (var key in ast.sons) {
                if (ast.sons[key].type == "ATOM") {
                    args.push(_exec_atom(ast.sons[key], context));
                } else if (ast.sons[key].type == "TRAILER") {
                    args.push(_exec_trailer(ast.sons[key], context));
                } else if (ast.sons[key].type == "**") {
                    var op = new ObjectClass.SObject();
                    op.type = "Option";
                    op.value = ast.sons[key].type;
                    args.push(op);
                } else if (ast.sons[key].type == "FACTOR") {
                    args.push(_exec_factor(ast.sons[key], context));
                }
            }
        }
        if (args.length == 1) {
            return args[0];
        }
        //result = /*FUNCTION*/(args);
        //return result;
    }
    
    /*
    Revised by Peng : currently support Number, String and Identity
    */
    function _exec_atom(ast,context,debug=_DEGUG) {
        debug = true;
        if (debug) {console.log("ATOM:");console.log(ast);}
        var result =new ObjectClass.SObject();
        if(ast.type == "ATOM"){
            if (ast.sons[0].type == "NAME") {
                result.name = ast.sons[0].value;
                result.type = "Identity";
                
                if (context.allEntry.contains_key(result.name)) {
                    var temp = context.allEntry[result.name];
                    result.type = temp.type;
                    result.value = temp.value;
                }
                return result;
            } else if (ast.sons[0].type == "NUMBER") {
                result.value = Number(ast.sons[0].value);
                result.type = "Number";
                return result;
            } else if (ast.sons[0].type == "STRING") {
                result.value = ast.sons[0].value;
                result.type = "String";
                return result;
            } else if (ast.sons[0].type == "LISTMAKER") {
                return _exec_listmaker(ast.sons[0],context);
            } else if (ast.sons[0].type == "DICTORSETMAKER") {
                return _exec_dictorsetmaker(ast.sons[0],context);
            } else if (ast.sons[0].type == "TESTLIST_COMP") {
                return _exec_testlist_comp(ast.sons[0],context);
            }
        }
    }

    function _exec_listmaker(ast,context) {
        var args = new Array();
        for (var item in ast.sons) {
            
        }
        return args;
    }
    
    function _exec_testlist_comp(ast,context) {
        var args = new Array();
        for (var item in ast.sons) {
            
        }
        return args;
    }

    function _exec_dictorsetmaker(ast, context) {
        var args = new Array();
        for (var item in ast.sons) {

        }
        return args;
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
