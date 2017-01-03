/*
Engine : Yuhao, Xuefeng & Peng
*/

module.exports = Engine;

function Engine() {

    var ObjectClass = require("./Object");
    var ResFuncSet = require("./Res");
    var debug = false;
    var breakTag=false;
    var returnTag=false;
    var continueTag=false;
    var returnTagStack=new Array();
    var whileTagStack=new Array();
    /*
    Reviewed
    */
    this._exec_file_input = function(ast, context, debug) {
        if (ast.type == "FILE_INPUT") {
            for (var key in ast.sons) {
                if (ast.sons[key].type == "STMT")
                    _exec_stmt(ast.sons[key], context);
            }
        }
        console.log(context.printEntry());
    }


    function _exec_suite(ast,context) {
        debug = true;
        if (debug) {console.log("============");console.log(ast);console.log(ast.sons.length);}
        for (var item in ast.sons) {
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!");
            console.log(ast.sons[item]);
            if (ast.sons[item].type == "SIMPLE_STMT")
                _exec_simple_stmt(ast.sons[item],context);
            else if (ast.sons[item].type == "STMT")
                _exec_stmt(ast.sons[item],context);
            else {
                console.log("Exec Suite Error :"+item);
            }
            if (breakTag) return;
            if (returnTag) return;
        }
    }

    this._exec_func_out = function(ast,context) {
        console.log("In EXEC FUNC");
        console.log(ast.sons);
        console.log(context.printEntry());
        for (var item in ast.sons) {
            if (ast.sons[item].type == "SUITE") {
                _exec_suite(ast.sons[item],context);
            }
            if (returnTag) {
                returnTag=false;
                return;
            }
        }
    }
    /*
    Written by Peng Function Implementation
    */
    function _exec_funcdef(ast, context, debug) {
        console.log("In Function DEF");
        console.log(ast);
        var FRecord = new ObjectClass.SFunction();
        var funcName = "";
        for (var item in ast.sons) {
            if (ast.sons[item].type == "NAME"){
                funcName = ast.sons[item].value;
                FRecord.name = funcName;
                FRecord.ast = ast;
            }
            if (ast.sons[item].type == "PARAMETERS") {
                FRecord.argument_list = _exec_parameters(ast.sons[item],context);
            }
        }
        var func = new ObjectClass.SObject();
        func.type = "Func";
        func.value = FRecord;
        func.name = funcName;
        context.allEntry[funcName] = func;
        console.log(context.printEntry());
    }

    function _exec_parameters(ast,context, debug){
        if (ast.sons[0].type == "VARARGSLIST") {
            return _exec_varargslist(ast.sons[0], context);
        }
    }

    function _exec_varargslist(ast, context, debug) {
        debug = true;
        var args = new Array();
        if (debug) {console.log("var AST #####"); console.log(ast.sons); console.log("#####") }
        for (var item in ast.sons) {
            if (ast.sons[item].type == "FPDEF") {
                args.push(_exec_fpdef(ast.sons[item],context));
            }
            if (ast.sons[item].type == "=" || ast.sons[item].type == "*" || ast.sons[item].type == "**") {
                var op = new ObjectClass.SObject();
                op.type = "Option";
                op.value = ast.sons[item].type;
                args.push(op);
            }
            if (ast.sons[item].type == "TEST") {
                args.push(_exec_test(ast.sons[item],context));
            }
            if (ast.sons[item].type == "NAME") {
                var name = new ObjectClass.SObject();
                name.name = ast.sons[item].value;
                name.type = "Identity";
                args.push(name);
            }
        }
        if (debug) {console.log("Func Args #####"); console.log(args); console.log("#####") }
        return args;
    }

    function _exec_fpdef(ast, context, debug) {
        debug = true;
        var fp = new ObjectClass.SObject();
        if (debug) {console.log("FPDEF #####"); console.log(ast); console.log("#####") }
        if (ast.sons[0].type=="NAME") {
            fp.name = ast.sons[0].value;
            fp.type = "Identity";
        }
        if (ast.sons[0].type== "FPLIST") {
            return -1;
        }
        if (debug) {console.log("FPDEF #####"); console.log(fp); console.log("#####") }
        return fp;
    }


    function _exec_classdef(ast, context, debug) {
        var CRecord = new ObjectClass.SClass();
        var className = "";
        for (var item in ast.sons) {
            if (ast.sons[item].type == "NAME") {
                className = ast.sons[item].value;
                CRecord.name = className;
            }
            if (ast.sons[item].type == "TESTLIST") {
                CRecord.father = _exec_testlist(ast.sons[item], context);
            }
            if (ast.sons[item].type == "SUITE") {
                _exec_suite(ast.sons[item], CRecord);
            }
        }
        var cls = new ObjectClass.SObject();
        cls.type = "Class";
        cls.value = CRecord;
        cls.name = className;
        console.log(CRecord.printEntry());
        context.allEntry[className] = cls;
    }

    /*
    Reviewed
    */
    function _exec_stmt(ast, context, debug) {
        console.log(context.printEntry());
        if (ast.type == "STMT") {
            if (ast.sons.length == 1) {
                if (ast.sons[0].type == "SIMPLE_STMT") {
                    _exec_simple_stmt(ast.sons[0], context);
                }
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

    function _exec_for_stmt(ast, context) {
        // wait for list structure
        var iter = _exec_testlist(ast.sons[0], context);
        var iterList = _exec_testlist(ast.sons[1], context);
        if (iter.length == 1) {
            var base = iter[0];
            for (var i in iterList[0]) {
                iter = iterList[i];
                context[base.name] = iter;
                _exec_suite(ast.sons[2]);
                if (breakTag) {
                    breakTag = false;
                    return;
                }
            }
        } else if (iter.length == 2) {
            var base1 = iter[0];
            var base2 = iter[1];
            for (var i in iterList) {

            }
        } else {
            console.log("FOR_exec_for_stmt ARGUE LEN ERROR");
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
                    var result = _exec_test(ast.sons[key], context);
                    console.log("&&&&&&&&&&&&&&&&&&&&&&&&");
                    console.log(result);
                    if (result.value) {
                        if (ast.sons[key+1].type == "SUITE") {
                            _exec_suite(ast.sons[key+1], context);
                            break;
                        }
                    }
                } else {
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
                    if (breakTag) {
                        breakTag=false;
                        return;
                    }
                    if (continueTag) {
                        continueTag=false;
                        continue;
                    }
                }
            }
        }
    }

    
    

    /*
    Reviewed
    */
    //simle stmt
    function _exec_simple_stmt(ast, context, debug) {
        console.log(context.printEntry());
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
    function _exec_expr_stmt(ast, context, debug) {
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
                for (var item in result[0].value) {
                    console.log("----")
                    console.log(result[0].value[item].value);
                }
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
    function _exec_testlist(ast, context, debug) {
        console.log(context.printEntry());
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
    function _exec_and_test(ast, context, debug) {
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
    function _exec_comparison(ast,context,debug) {
        console.log(context.printEntry());
        debug = true;
        var result;
        var args = new Array();
        if (debug) {console.log("COMPARISON AST TREE #####");console.log(ast);console.log("#####");}
        if(ast.type == "COMPARISON"){
            for(i=0;i<ast.sons.length;i++) {
                if(ast.sons[i].type == "EXPR")
                   args.push(_exec_expr(ast.sons[i], context));
                else if(ast.sons[i].type == "COMP_OP")
                   args.push(_exec_comp_op(ast.sons[i],context));
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
        result.value = ast.value;
        return result;
    }



    /*
    Revised by Peng: unfinished
    */
    function _exec_print_stmt(ast,context,debug) {
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
    function _exec_expr(ast,context,debug) {
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
    function _exec_shift_expr(ast,context,debug) {
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
    function _exec_arith_expr(ast,context,debug) {
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
    function _exec_term(ast,context,debug) {
        debug = true;
        var result;
        var args = new Array();
        console.log("################################# SONS length");
        console.log(ast.sons[0]);
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
    function _exec_factor(ast,context,debug) {
        console.log(context.printEntry());
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
                    return _exec_power(ast.sons[key], context);
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
    function _exec_power(ast, context, debug) {
        console.log(context.printEntry());
        var result;
        var args = new Array();
        debug = true;
        if (debug) {console.log("POWER AST #####");console.log(ast);console.log("#####")}
        if (ast.type == "POWER") {
            for (var key in ast.sons) {
                if (ast.sons[key].type == "ATOM") {
                    args.push(_exec_atom(ast.sons[key], context));
                } else if (ast.sons[key].type == "TRAILER") {
                    console.log("++++++++++++++++++++++++");console.log(ast.sons[key]);
                    args.push(_exec_trailer(ast.sons[key], context));
                // } else if (ast.sons[key].type == "**") {
                //     var op = new ObjectClass.SObject();
                //     op.type = "Option";
                //     op.value = ast.sons[key].type;
                //     args.push(op);
                } else if (ast.sons[key].type == "FACTOR") {
                    args.push(_exec_factor(ast.sons[key], context));
                }
            }
        }
        if (args.length == 1) {
            return args[0];
        } else {
            if (debug) {console.log("POWER ARGUE #####");console.log(args);console.log("#####")}
            result = ResFuncSet.RES_power(args,context);
            if (debug) {console.log("POWER RESULT #####");console.log(result);console.log("#####")}
            return result;
        }
    }


    function _exec_trailer(ast, context, debug) {
        var op = new ObjectClass.SObject()
        if (ast.sons.length == 0) {
            op.type = "FunNull";
        }
        if (ast.sons.length == 1) {
            if (ast.sons[0].type == "NAME") {
                op.type = "NAME";
                op.value = ast.sons[0].value;
            } else if (ast.sons[0].type == "ARGLIST") {
                op.type = "ARGLIST";
                op.value = _exec_arglist(ast.sons[0], context);
            } else if (ast.sons[0].type == "SUBSCRIPTLIST") {
                op.type = "SUBSCRIPTLIST";
                op.value = _exec_subscriptlist(ast.sons[0], context);  //array[array[str,end,step]...]             
            }
        }
        if (debug) {console.log("TRAILER RESULT #####");console.log(op);console.log("#####")}
        return op;
    }

        //subscriptlist: subscript (',' subscript)* [',']
    function _exec_subscriptlist(ast, context) {
        var subscriptlist=new Array();
        if(ast.type == "SUBSCRIPTLIST"){
            if(ast.sons.length == 0)
                console.log("subscriptlist Length Error");
            else {
                for (var sonnum in ast.sons){
                    subscriptlist.push(_exec_subscript(ast.sons[sonnum],context));
                }
                return subscriptlist;
            }
        }
    }   

    //subscript: '.' '.' '.' | test | [test] ':' [test] [sliceop]
    function _exec_subscript(ast, context) {
        var subscript=new Array();
        var step=1;
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
        console.log(ast);
        if(ast.type == "SUBSCRIPT"){
            if(ast.sons.length!=0 && ast.sons[ast.sons.length-1].type=="SLICEOP"){
                step=_exec_sliceop(ast.sons[ast.sons.length-1], context);
            }
            console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
            console.log(step);
            console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
            console.log(ast.sons);
            console.log(ast.sons[0]);
            if(ast.sons.length==1 && ast.sons[0].type=="TEST"){//test
                temp = _exec_test(ast.sons[0], context);
                if (temp.type=="Number" && temp.value!=null){
                    subscript.push(temp.value);
                    subscript.push(temp.value+1);
                    subscript.push(1);
                    subscript.push("loc");
                    return subscript;
                }
                if (temp.type=="String" && temp.value!=null){
                    subscript.push(temp.value);
                    subscript.push("str");
                    subscript.push("str");
                    subscript.push("loc");
                    return subscript;
                }
                else
                    console.log("subscript type Error");
            }
            else if(ast.sons.length >= 2 && ast.sons[0].type=="TEST" && ast.sons[1].type==":" && (ast.sons.length==2 || ast.sons.length==3 && ast.sons[2].type == "SUBSCRIPT")){//test:
                temp = _exec_test(ast.sons[0], context);
                if (temp.type=="Number" && temp.value!=null){
                    subscript.push(temp.value);
                    subscript.push(null);
                    subscript.push(step);
                    subscript.push("slice");
                    return subscript;
                }
                else
                    console.log("subscript type Error");
            }
            else if(ast.sons.length >= 2 && ast.sons[0].type==":" && ast.sons[1].type=="TEST"){//:test
                temp = _exec_test(ast.sons[1], context);
                if (temp.type=="Number" && temp.value!=null){
                    subscript.push(null);
                    subscript.push(temp.value);
                    subscript.push(step);
                    subscript.push("slice");
                    return subscript;
                }
                else
                    console.log("subscript type Error");
            }
            else if(ast.sons[0].type==":" &&  (ast.sons.length==1 || ast.sons.length==2 && ast.sons[1].type == "SLICEOP")){//:
                subscript.push(null);
                subscript.push(null);
                subscript.push(step);
                subscript.push("slice");
                return subscript;
            }
            else if(ast.sons.length >=3 && ast.sons[0].type=="TEST" && ast.sons[1].type==":" && ast.sons[2].type=="TEST"){//test:test
                temp0 = _exec_test(ast.sons[0], context);
                temp1 = _exec_test(ast.sons[2], context);
                if (temp0.type=="Number" && temp0.value!=null && temp1.type=="Number" && temp1.value!=null ){
                    subscript.push(temp0.value);
                    subscript.push(temp1.value);
                    subscript.push(step);
                    subscript.push("slice");
                    return subscript;
                }
                else
                    console.log("subscript type Error");
            }            
            else {
                console.log("subscript Length Error");
            }
        }
    }                  


    // //subscript: '.' '.' '.' | test | [test] ':' [test] [sliceop]
    // function _exec_subscript(ast, context) {
    //     var subscript=new Array();
    //     var step=1;
    //     if(ast.type == "SUBSCRIPT"){
    //         if(ast.sons.length!=0 && ast.sons[ast.sons.length-1].type=="SLICEOP"){
    //             step=_exec_sliceop(ast.sons[ast.sons.length-1], context);
    //         }
    //         if(ast.sons.length==1 && ast.sons[0].type=="TEST"){//test
    //             temp = _exec_test(ast.sons[0], context);
    //             if (temp.type=="Number" && temp.value!=null){
    //                 subscript.push(temp.value);
    //                 subscript.push(temp.value+1);
    //                 subscript.push(1);
    //                 subscript.push("loc");
    //                 return subscript;
    //             }
    //             if (temp.type=="String" && temp.value!=null){
    //                 subscript.push(temp.value);
    //                 subscript.push("str");
    //                 subscript.push("str");
    //                 subscript.push("loc");
    //                 return subscript;
    //             }
    //             else
    //                 console.log("subscript type Error");
    //         }
    //         else if(ast.sons[0].type=="TEST" && ast.sons[1].value==":"){//test:
    //             temp = _exec_test(ast.sons[0], context);
    //             if (temp.type=="Number" && temp.value!=null){
    //                 subscript.push(temp.value);
    //                 subscript.push(null);
    //                 subscript.push(step);
    //                 subscript.push("slice");
    //                 return subscript;
    //             }
    //             else
    //                 console.log("subscript type Error");
    //         }
    //         else if(ast.sons[1].type=="TEST" && ast.sons[0].value==":"){//:test
    //             temp = _exec_test(ast.sons[1], context);
    //             if (temp.type=="Number" && temp.value!=null){
    //                 subscript.push(null);
    //                 subscript.push(temp.value);
    //                 subscript.push(step);
    //                 subscript.push("slice");
    //                 return subscript;
    //             }
    //             else
    //                 console.log("subscript type Error");
    //         }
    //         else {
    //             console.log("subscript Length Error");
    //         }
    //     }
    // }    

    function _exec_sliceop(ast, context) {
        if(ast.type == "SLICEOP"){
            if(ast.sons.length == 0)
                return 1;
            else if(ast.sons.length == 1 && ast.sons[0].type=="TEST"){
                temp = _exec_test(ast.sons[0], context);
                if (temp.type=="Number" && temp.value!=null)
                    return temp.value;
                else
                    console.log("sliceop type Error");
            }
            else {
                console.log("sliceop Length Error");
            }
        }
    }

    function _exec_arglist(ast, context) {
        var args = new Array();
        for (var item in ast.sons) {
            if (ast.sons[item].type == "ARGUMENT") {
                args.push(_exec_argument(ast.sons[item],context));
            }
            if (ast.sons[item].type == "*" || ast.sons[item].type == "**") {
                var op = new ObjectClass.SObject();
                op.type = "Option";
                op.value = ast.sons[item].type;
                args.push(op);
            }
            if (ast.sons[item].type == "TEST") {
                args.push(_exec_test(ast.sons[item], context));
            }
        }
        return args;
    }

    function get_test_argument(ast) {
        while (ast.type != "NAME") {
            ast = ast.sons[0];
        }
        return ast.value;
    }

    function _exec_argument(ast, context) {
        var result = new ObjectClass.SObject();
        if (ast.sons.length>1) {
            if (ast.sons[1].type == "TEST") {
                result.name = get_test_argument(ast.sons[0]);
                var arg = _exec_test(ast.sons[1],context);
                result.type = arg.type;
                result.value = arg.value;
                //result.name = arg.name;
            } else if (ast.sons[1].type == "COMP_FOR"){
                // To be finished
            }
        } else if (ast.sons.length == 1) {
            result = _exec_test(ast.sons[0], context);
            result.name = "_un_assigned_";

        }
        return result;
    }
    
    /*
    Revised by Peng : currently support Number, String and Identity
    */
    function _exec_atom(ast,context,debug) {
        debug = true;
        if (debug) {console.log("ATOM:");console.log(ast);}
        var result =new ObjectClass.SObject();
        if(ast.type == "ATOM"){
            if (ast.sons[0].type == "NAME") {
                result.name = ast.sons[0].value;
                result.type = "Identity";
                temp_context = context;
                while (temp_context != null && temp_context != undefined) {
                    if (temp_context.allEntry[result.name]!=undefined) {
                        var temp = temp_context.allEntry[result.name];
                        result.type = temp.type;
                        result.value = temp.value;
                        break;
                    } else {
                        temp_context = temp_context.outFunction;
                    }
                }
                console.log(context.printEntry());
                console.log(result);
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
        var args = new ObjectClass.SObject();
        args.type="List";
        var args_value = new Array();
        for (var i in ast.sons) {
            if(ast.sons[i].type == "TEST"){
                var temp=_exec_test(ast.sons[i],context).copy();
                temp.ismember=1;
                temp.name="";
                args_value.push(temp);
            }         
        }
        args.value=args_value;
        return args;
    }
    
    function _exec_testlist_comp(ast,context) {
        var args = new ObjectClass.SObject();
        args.type="Tuple";
        var args_value = new Array();
        for (var i in ast.sons) {
            if(ast.sons[i].type == "TEST"){
                var temp=_exec_test(ast.sons[i],context).copy();
                temp.ismember=2;
                temp.name="";
                if(temp.type=="List" || temp.type=="Dictionary" || temp.type=="Identity")
                    console.log("Tuple can't contain List or Dictionary or undefine identity");
                else{
                    args_value.push(temp);
                }
            }         
        }
        args.value=args_value;
        return args;
    }

    function _exec_dictorsetmaker(ast, context) {
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        var args = new ObjectClass.SObject();
        args.type="Dictionary";
        var args_value = new Array();
        for (var i=0;i<ast.sons.length;i=i+3) {
            if(ast.sons[i].type == "TEST" && ast.sons[i+2].type == "TEST" ){
                console.log("+++++++++++");
                console.log(ast.sons[i]);
                console.log(ast.sons[i+2]);
                var temp1=_exec_test(ast.sons[i],context).copy();
                temp1.ismember=31;
                temp1.name="";
                var temp2=_exec_test(ast.sons[i+2],context).copy();
                temp2.ismember=32;
                temp2.name="";
                if(temp1.type!="Number" && temp1.type!="String" )
                    console.log("Dic_key can only support Number and String");
                else{
                    console.log("+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_");
                    console.log(temp1);
                    console.log(temp2);
                    if (temp1.type == "String")
                        args_value["S_"+temp1.value]=temp2;
                    else 
                        args_value["N_"+temp1.value]=temp2;
                }
            }         
        }
        args.value=args_value;
        console.log("+++++++++++++++++++++++++++");
        console.log(args);
        return args;
    }

    function _exec_pass_stmt(ast,context) {
        if(ast.type == "PASS_STMT"){
            console.log("pass");
        }
    }

    function _exec_flow_stmt(ast,context){
        console.log(context.printEntry());
        if(ast.type == "FLOW_STMT"){
            if(ast.sons.length == 1){
                if(ast.sons[0].type =="BREAK_STMT") {
                    console.log("break");
                    breakTag = true;
                }
                else if(ast.sons[0].type == "CONTINUE_STMT") {
                    console.log("continue");
                    continueTag = true;
                }
                    
                else if(ast.sons[0].type == "RETURN_STMT") {
                    _exec_return_stmt(ast.sons[0],context);
                    console.log("ENTER RRRRRRRRRRRRRRReturn");
                }
                else if(ast.sons[0].type == "RAISE_STMT")
                    _exec_raise_stmt(ast.sons[0],context);
            }
            else {
                console.log("Flow_Stmt Length Error");
            }
        }
    }

    function _exec_return_stmt(ast, context) {
        if (ast.sons[0].type == "RETURN") {
            var args = _exec_testlist(ast.sons[1],context);
            var result = new Array();
            for (var item in args) {
                result.push(args[item]);
            }
            console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQ");
            console.log(result);
            context.return_value = result;
            returnTag = true;
        }
        
    }
    

}
