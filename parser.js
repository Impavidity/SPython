/*
Parser
*/

module.exports = Parser;


function Parser(file) {
    var lexerClass = require('./tokenizer');
    var lexer = new lexerClass(file);
    var currentToken = lexer.getToken();
    var treeNodeClass = require('./treeNode');
    var comp_op = ['<','>','==','>=','<=','<>','!=','in','is'];
    var augassign = ['+=','-=','*=','/=','%=','&=','|=','^=','<<=','>>=','**=','//='];
    var indent_level = 0;
    var indent_stack = new Array();
    var base_indent = 0;

    function _match(type) {
        // console.log(currentToken);
        if (currentToken.type == type) {
            currentToken = lexer.getToken();
            console.log(currentToken);
            return true;
        } else {
            console.log("Error : My Type: "+currentToken.type+" But expect: "+type);
            //return false;
            process.exit();
        }
    }

    this._file_input = function(indent) {
        var treeNode = new treeNodeClass();
        treeNode.type = "FILE_INPUT";
        while (currentToken.type != "EOF") {
            if (currentToken.type == "NEWLINE") {
                _match("NEWLINE");
                continue;
            }
            var stmt = _stmt(indent);
            //console.log(stmt);
            treeNode.sons.push(stmt);
        }
        return treeNode;
    }

    function _stmt(indent) {
        var treeNode = new treeNodeClass();
        treeNode.type = "STMT";
        if (currentToken.type == "PRINT" || currentToken.type == "DEL" || 
            currentToken.type == "NAME" || currentToken.type == "BREAK" ||
            currentToken.type == "CONTINUE" || currentToken.type == "RETURN") {
            treeNode.sons.push(_simple_stmt());
        } else if (currentToken.type == "IF" || currentToken.type == "WHILE" || currentToken.type == "FOR" ||
            currentToken.type == "DEF" || currentToken.type == "CLASS") {
            treeNode.sons.push(_compound_stmt(indent));
        }
        return treeNode;
    }



    function _simple_stmt() {
        var treeNode = new treeNodeClass();
        treeNode.type = "SIMPLE_STMT";
        if (currentToken.type == "PRINT") {
            treeNode.sons.push(_print_stmt());
        } else if (currentToken.type == "DEL") {
            treeNode.sons.push(_del_stmt());
        } else if (currentToken.type == "NAME") {
            treeNode.sons.push(_expr_stmt());
        } else if (currentToken.type == "BREAK") {
            treeNode.sons.push(_flow_stmt());
        } else if (currentToken.type == "CONTINUE") {
            treeNode.sons.push(_flow_stmt());
        } else if (currentToken.type == "RETURN") {
            treeNode.sons.push(_flow_stmt());
        }
        return treeNode;
    }

    function _flow_stmt() {
        var treeNode = new treeNodeClass();
        treeNode.type = "FLOW_STMT";
        if (currentToken.type == "BREAK") {
            treeNode.sons.push(_break_stmt());
        } else if (currentToken.type == "CONTINUE") {
            treeNode.sons.push(_continue_stmt());
        } else if (currentToken.type == "RETURN") {
            treeNode.sons.push(_return_stmt());
        }
        return treeNode;
    }

    function _break_stmt() {
        var treeNode = new treeNodeClass();
        treeNode.type = "BREAK_STMT";
        treeNode.sons.push(currentToken);
        _match("BREAK");
        return treeNode;
    }

    function _continue_stmt() {
        var treeNode = new treeNodeClass();
        treeNode.type = "CONTINUE_STMT";
        treeNode.sons.push(currentToken);
        _match("CONTINUE");
        return treeNode;
    }

    function _return_stmt() {
        var treeNode = new treeNodeClass();
        treeNode.type = "RETURN_STMT";
        treeNode.sons.push(currentToken);
        _match("RETURN");
        if (currentToken.type != "NEWLINE")
            treeNode.sons.push(_testlist());
        return treeNode;
    }

    function _compound_stmt(indent) {
        var treeNode = new treeNodeClass();
        treeNode.type = "COMPOUND_STMT";
        if (currentToken.type == "IF") {
            treeNode.sons.push(_if_stmt(indent));
        } else if (currentToken.type == "WHILE") {
            treeNode.sons.push(_while_stmt(indent));
        } else if (currentToken.type == "FOR") {
            treeNode.sons.push(_for_stmt(indent));
        } else if (currentToken.type == "DEF") {
            treeNode.sons.push(_funcdef(indent));
        } else if (currentToken.type == "CLASS") {
            treeNode.sons.push(_classdef(indent));
        }
        return treeNode;
    }

    function _funcdef(indent) {
        var treeNode = new treeNodeClass();
        treeNode.type = "FUNCDEF";
        _match("DEF");
        var name = currentToken;
        _match("NAME");
        treeNode.sons.push(name);
        treeNode.sons.push(_parameters());
        _match(":");
        treeNode.sons.push(_suite(indent+1));
        return treeNode;
    }

    function _parameters() {
        var treeNode = new treeNodeClass();
        treeNode.type = "PARAMETERS";
        _match("(");
        if (currentToken.type != ")") {
            treeNode.sons.push(_varargslist());
        }
        _match(")");
        return treeNode;
    }

    function _varargslist() {
        var treeNode = new treeNodeClass();
        treeNode.type = "VARARGSLIST";
        if (currentToken.type == "*") {
            treeNode.sons.push(currentToken);
            _match("*");
            treeNode.sons.push(currentToken);
            _match("NAME");
            if (currentToken.type == ',') {
                _match(',');
                treeNode.sons.push(currentToken);
                _match('**');
                treeNode.sons.push(currentToken);
                _match("NAME");
            }
        } else if (currentToken.type == "**") {
            treeNode.sons.push(currentToken);
            _match("**");
            treeNode.sons.push(currentToken);
            _match("NAME");
        } else {
            treeNode.sons.push(_fpdef());
            if (currentToken.type == "=") {
                treeNode.sons.push(currentToken);
                _match('=');
                treeNode.sons.push(_test());
            }
            while (currentToken.type == ',') {
                _match(',');
                if (currentToken.type == '*') {
                    treeNode.sons.push(currentToken);
                    _match('*');
                    var name = currentToken;
                    _match("NAME");
                    treeNode.sons.push(name);
                } else if (currentToken.type == '**') {
                    treeNode.sons.push(currentToken);
                    _match('**');
                    var name = currentToken;
                    _match("NAME");
                    treeNode.sons.push(name);
                } else {
                    treeNode.sons.push(_fpdef());
                    if (currentToken.type == "=") {
                        treeNode.sons.push(currentToken);
                        _match("=");
                        treeNode.sons.push(_test());
                    }
                }
            }
        }
        
        return treeNode;
    }

    function _fpdef() {
        var treeNode = new treeNodeClass();
        treeNode.type = "FPDEF";
        if (currentToken.type == '(') {
            _match('(');
            treeNode.sons.push(_fplist());
            _match(')');
        } else {
            var name = currentToken;
            _match("NAME");
            treeNode.sons.push(name);
        }
        return treeNode;
    }

    function _fplist() {
        var treeNode = new treeNodeClass();
        treeNode.type = "FPLIST";
        treeNode.sons.push(_fpdef());
        while (currentToken.type == ',') {
            _match(',');
            treeNode.sons.push(_fpdef());
        }
        return treeNode;
    }

    function _argument() {
        var treeNode = new treeNodeClass();
        treeNode.type = "ARGUMENT";
        treeNode.sons.push(_test());
        if (currentToken.type == "=") {
            _match("=");
            treeNode.sons.push(_test());
        } else if (currentToken.type == "FOR") {
            treeNode.sons.push(_comp_for());
        }
        return treeNode;
    }

    function _arglist() {
        var treeNode = new treeNodeClass();
        treeNode.type = "ARGLIST";
        if (currentToken.type == "*") {
            treeNode.sons.push(currentToken);
            _match('*');
            treeNode.sons.push(_test());
            while (currentToken.type == ',') {
                _match(',');
                if (currentToken.type == "**") {
                    treeNode.sons.push(currentToken);
                    _match("**");
                    treeNode.sons.push(_test());
                } else {
                    treeNode.sons.push(_argument());
                }
            }
        } else if (currentToken.type == "**") {
            treeNode.sons.push("**");
            treeNode.sons.push(_test());
        } else {
            treeNode.sons.push(_argument());
            while (currentToken.type == ',') {
                _match(',');
                if (currentToken.type == "*") {
                    treeNode.sons.push(currentToken);
                    _match('*');
                    treeNode.sons.push(_test());
                    while (currentToken.type == ',') {
                        _match(',');
                        if (currentToken.type == "**") {
                            treeNode.sons.push(currentToken);
                            _match("**");
                            treeNode.sons.push(_test());
                        } else {
                            treeNode.sons.push(_argument());
                        }
                    }
                } else if (currentToken.type == "**") {
                    treeNode.sons.push("**");
                    treeNode.sons.push(_test());
                } else {
                    treeNode.sons.push(_argument());
                }
            }
        }
        return treeNode;
    }

    function _classdef(indent) {
        var treeNode = new treeNodeClass();
        treeNode.type = "CLASSDEF";
        _match("CLASS");
        var name = currentToken;
        _match("NAME");
        treeNode.sons.push(name);
        if (currentToken.type == '(') {
            _match('(');
            if (currentToken.type != ')') {
                treeNode.sons.push(_testlist());
            }
            _match(')');
        }
        _match(':');
        treeNode.sons.push(_suite(indent+1));
        return treeNode;
    }

    function _for_stmt(indent) {
        var treeNode = new treeNodeClass();
        treeNode.type = "FOR_STMT";
        _match("FOR");
        treeNode.sons.push(_exprlist());
        _match("IN");
        treeNode.sons.push(_testlist());
        _match(":");
        treeNode.sons.push(_suite(indent+1));
        return treeNode;
    }

    function _while_stmt(indent) {
        var treeNode = new treeNodeClass();
        treeNode.type = "WHILE_STMT";
        _match("WHILE");
        treeNode.sons.push(_test());
        _match(":");
        treeNode.sons.push(_suite(indent+1));
        return treeNode;
    }

    function _if_stmt(indent) {
        var treeNode = new treeNodeClass();
        treeNode.type = "IF_STMT";
        _match("IF");
        treeNode.sons.push(_test());
        _match(":");
        treeNode.sons.push(_suite(indent+1));
        while (currentToken.type == "ELIF") {
            _match("ELIF");
            treeNode.sons.push(_test());
            _match(":");
            treeNode.sons.push(_suite(indent+1));
        }
        if (currentToken.type == "ELSE") {
            _match("ELSE");
            _match(":");
            treeNode.sons.push(_suite(indent+1));
        }
        return treeNode;
    }


    var counti=0;
    function _suite(indent) {
        //console.log("current indent : "+indent);
        //console.log("current counti : "+counti);
        var treeNode = new treeNodeClass();
        treeNode.type = "SUITE";
        if (currentToken.type == "NEWLINE") {
            do {
                if (currentToken.type == "NEWLINE") {
                    _match("NEWLINE");
                    counti = 0;
                }
                while (currentToken.type == "INDENT") {
                    _match("INDENT");
                    counti += 1;
                }
                if (currentToken.type == "NEWLINE") {
                    _match("NEWLINE");
                    counti=0;
                    continue;
                }
                console.log("i:"+counti+" base_indent:"+indent);
                if (counti == indent) {
                    treeNode.sons.push(_stmt(indent));
                }
            } while (counti == indent);
            return treeNode;

        } else {
            treeNode.sons.push(_simple_stmt());
        }
    }

    function _del_stmt() {
        var treeNode = new treeNodeClass();
        treeNode.type = "DEL_STMT";
        _match("DEL");
        treeNode.sons.push(_exprlist());
        return treeNode;
    }

    function _print_stmt() {
        var treeNode = new treeNodeClass();
        treeNode.type = "PRINT_STMT";
        _match("PRINT");
        treeNode.sons.push(_testlist());
        return treeNode;
    }

    function _expr_stmt() {
        var treeNode = new treeNodeClass();
        treeNode.type = "EXPR_STMT";
        treeNode.sons.push(_testlist());
        
        if (currentToken.type == "=") {
            treeNode.sons.push(currentToken);
            _match("=");
            treeNode.sons.push(_testlist());
        } else {
            if (augassign.indexOf(currentToken.type)!=-1) {
                currentToken.type = "AUGASSIGN";
                treeNode.sons.push(currentToken);
                _match(currentToken.type);
                treeNode.sons.push(_testlist());
            } else {
                console.log("Wrong Augassign");
                process.exit(0);
            }
        }
        return treeNode;
    }

    function _exprlist() {
        var treeNode = new treeNodeClass();
        treeNode.type = "EXPRLIST";
        treeNode.sons.push(_expr());
        while (currentToken.type == ',') {
            _match(',');
            treeNode.sons.push(_expr());
        }
        return treeNode;
    }

    function _testlist() {
        var treeNode = new treeNodeClass();
        treeNode.type = "TESTLIST";
        // console.log("I am in testlist");
        treeNode.sons.push(_test());
        // console.log(currentToken);
        while (currentToken.type == ',') {
            _match(',');
            treeNode.sons.push(_test());
        }
        return treeNode;
    }

    function _test() {
        var treeNode = new treeNodeClass();
        treeNode.type = "TEST";
        // console.log("I am in test");
        treeNode.sons.push(_or_test());
        return treeNode;
        /*
        _match("NUMBER");
        var treeNode = new treeNodeClass();
        treeNode.type = "TEST";
        return treeNode;
        */
    }

    function _or_test() {
        var treeNode = new treeNodeClass();
        treeNode.type = "OR_TEST";
        // console.log("I am in or_test");
        treeNode.sons.push(_and_test());
        while (currentToken.type == "OR") {
            _match("OR");
            treeNode.sons.push(_and_test());
        }
        return treeNode;
    }

    function _and_test() {
        var treeNode = new treeNodeClass();
        treeNode.type = "AND_TEST";
        // console.log("I am in and_test");
        treeNode.sons.push(_not_test());
        while (currentToken.type == "AND") {
            _match("AND");
            treeNode.sons.push(_not_test());
        }
        return treeNode;
    }

    function _not_test() {
        var treeNode = new treeNodeClass();
        // console.log("I am in not test");
        treeNode.type = "NOT_TEST";
        if (currentToken.type == "NOT") {
            _match("NOT");
            treeNode.sons.push(_not_test());
        } else {
            treeNode.sons.push(_comparison());
        }
        return treeNode;
    }

    function _comparison() {
        var treeNode = new treeNodeClass();
        treeNode.type = "COMPARISON";
        // console.log("I am in comparison");
        treeNode.sons.push(_expr());
        while (comp_op.indexOf(currentToken.type)!=-1) {
            currentToken.type = "COMP_OP";
            op = currentToken;
            _match(currentToken.type);
            treeNode.sons.push(op);
            treeNode.sons.push(_expr());
        }
        return treeNode;
    }

    function _expr() {
        var treeNode = new treeNodeClass();
        treeNode.type = "EXPR";
        // console.log("I am in expr");
        treeNode.sons.push(_xor_expr());
        while (currentToken.type == '|') {
            _match('|');
            treeNode.sons.push(_xor_expr());
        }
        return treeNode;
    }

    function _xor_expr() {
        var treeNode = new treeNodeClass();
        treeNode.type = "XOR_EXPR";
        // console.log("I am in xor expr");
        treeNode.sons.push(_and_expr());
        while (currentToken.type == '^') {
            _match('^');
            treeNode.sons.push(_and_expr());
        }
        return treeNode;
    }

    function _and_expr() {
        var treeNode = new treeNodeClass();
        treeNode.type = "AND_EXPR";
        // console.log("I am in and expr");
        treeNode.sons.push(_shift_expr());
        while (currentToken.type == '&') {
            _match('&');
            treeNode.sons.push(_shift_expr());
        }
        return treeNode;
    }

    function _shift_expr() {
        var treeNode = new treeNodeClass();
        treeNode.type = "SHIFT_EXPR";
        // console.log("I am in shift expr");
        treeNode.sons.push(_arith_expr());
        while (currentToken.type == "<<" || currentToken.type == ">>") {
            op = currentToken;
            _match(currentToken.type);
            treeNode.sons.push(op);
            treeNode.sons.push(_arith_expr());
        }
        return treeNode;
    }

    function _arith_expr() {
        var treeNode = new treeNodeClass();
        treeNode.type = "ARITH_EXPR";
        // console.log("I am in arith expr");
        treeNode.sons.push(_term());
        while (currentToken.type == '+' || currentToken.type == '-') {
            op = currentToken;
            _match(currentToken.type);
            treeNode.sons.push(op);
            treeNode.sons.push(_term());
        }
        return treeNode;
    }

    function _term() {
        var treeNode = new treeNodeClass();
        treeNode.type = "TERM";
        // console.log("I am in term");
        treeNode.sons.push(_factor());
        while (currentToken.type == '*' || currentToken.type == '/' || currentToken.type == '%' || currentToken.type == '//') {
            op = currentToken;
            _match(currentToken.type);
            treeNode.sons.push(op);
            treeNode.sons.push(_factor());
        }
        return treeNode;
    }

    function _factor() {
        var treeNode = new treeNodeClass();
        treeNode.type = "FACTOR";
        // console.log("I am in factor");
        if (currentToken.type == '+' || currentToken.type == '-' || currentToken.type == '~') {
            op = currentToken;
            _match(currentToken.type);
            treeNode.sons.push(op);
            treeNode.sons.push(_factor());
        } else {
            treeNode.sons.push(_power());
        }
        return treeNode;
    }

    function _power() {
        //Not finished
        var treeNode = new treeNodeClass();
        treeNode.type = "POWER";
        // console.log("I am in power");
        treeNode.sons.push(_atom());
        while (currentToken.type == '(' || currentToken.type == '[' || currentToken.type == '.') {
            treeNode.sons.push(_trailer());
        }
        if (currentToken.type == "**") {
            treeNode.sons.push(currentToken);
            _match("**");
            treeNode.sons.push(_factor());
        }
        return treeNode;
    }

    function _trailer() {
        var treeNode = new treeNodeClass();
        treeNode.type = "TRAILER";
        if (currentToken.type == '(') {
            _match('(');
            if (currentToken.type != ')') {
                treeNode.sons.push(_arglist());
            }
            if (currentToken.type == ')')
                _match(')')
        } else if (currentToken.type == '[') {
            _match('[');
            treeNode.sons.push(_subscriptlist());
            _match(']');
        } else if (currentToken.type == '.') {
            _match('.');
            var name = currentToken;
            _match("NAME");
            treeNode.sons.push(name);
        }
        return treeNode;
    }

    function _atom() {
        var treeNode = new treeNodeClass();
        treeNode.type = "ATOM";
        // console.log("I am in atom");
        if (currentToken.type == '(') {
            _match('(');
            if (currentToken.type != ')') {
                var testlist = _testlist_comp();
                treeNode.sons.push(testlist);
            }
            _match(')');
        } else if (currentToken.type == '[') {
            _match('[');
            if (currentToken.type != ']') {
                var testlist = _listmaker();
                treeNode.sons.push(testlist);
            }
            _match(']');
        } else if (currentToken.type == '{') {
            _match('{');
            if (currentToken.type != '}') {
                var testlist = _dictorsetmaker();
                treeNode.sons.push(testlist);
            }
            _match('}');
        } else if (currentToken.type == "NAME") {
            // console.log("I am in NAME");
            var name = currentToken;
            _match("NAME");
            treeNode.sons.push(name);
        } else if (currentToken.type == "NUMBER") {
            // console.log("I am in NUMBER");
            var number = currentToken;
            _match("NUMBER");
            treeNode.sons.push(number);
        } else if (currentToken.type == "STRING") {
            // do not support string+ currently
            var strings = currentToken;
            _match("STRING");
            treeNode.sons.push(strings);
        }
        // console.log(treeNode);
        return treeNode;
    }

    function _dictorsetmaker() {
        var treeNode = new treeNodeClass();
        treeNode.type = "DICTORSETMAKER";
        treeNode.sons.push(_test());
        if (currentToken.type == ":") {
            treeNode.sons.push(currentToken);
            _match(":");
            treeNode.sons.push(_test());
            if (currentToken.type == "FOR") {
                treeNode.sons.push(_comp_for());
            } else if (currentToken.type == ',') {
                while (currentToken.type == ',') {
                    _match(',')
                    treeNode.sons.push(_test());
                    if (currentToken.type == ":") {
                        treeNode.sons.push(currentToken);
                        _match(":");
                        treeNode.sons.push(_test());
                    }
                }
            }
        } else {
            if (currentToken.type == "FOR") {
                treeNode.sons.push(_comp_for());
            } else if (currentToken.type == ',') {
                while (currentToken.type == ',') {
                    _match(',');
                    treeNode.sons.push(_test());
                }
            }
        }
        return treeNode;
    }

    function _testlist_comp() {
        var treeNode = new treeNodeClass();
        treeNode.type = "TESTLIST_COMP";
        treeNode.sons.push(_test());
        if (currentToken.type == "FOR") {
            treeNode.sons.push(_comp_for());
        } else if (currentToken.type == ',') {
            while (currentToken.type == ',') {
                _match(',');
                treeNode.sons.push(_test());
            }
        }
        return treeNode;
    }

    function _listmaker() {
        var treeNode = new treeNodeClass();
        treeNode.type = "LISTMAKER";
        treeNode.sons.push(_test());
        if (currentToken.type == "FOR") {
            treeNode.sons.push(_list_for()); 
        } else if (currentToken.type == ',') {
            while (currentToken.type == ',') {
                _match(',');
                treeNode.sons.push(_test());    
            }
        }
        return treeNode;
    }

    function _list_for() {
        var treeNode = new treeNodeClass();
        treeNode.type = "LIST_FOR";
        _match("FOR");
        treeNode.sons.push(_exprlist());
        _match("IN");
        treeNode.sons.push(_testlist_safe());
        if (currentToken.type == "FOR" || currentToken.type == "IF") {
            treeNode.sons.push(_list_iter());
        }
        return treeNode;
    }

    function _testlist_safe() {
        var treeNode = new treeNodeClass();
        treeNode.type = "TESTLIST_SAFE";
        treeNode.sons.push(_old_test());
        while (currentToken.type == ',') {
            _match(",");
            treeNode.sons.push(_old_test());
        }
        return treeNode;
    }

    function _list_iter() {
        var treeNode = new treeNodeClass();
        treeNode.type = "LIST_ITER";
        if (currentToken.type == "FOR") {
            treeNode.sons.push(_list_for());
        } else if (currentToken.type == "IF") {
            treeNode.sons.push(_list_if());
        }
        return treeNode;
    }

    function _list_if() {
        var treeNode = new treeNodeClass();
        treeNode.type = "LIST_IF";
        _match("IF");
        treeNode.sons.push(_old_test());
        if (currentToken.type == "FOR" || currentToken.type == "IF") {
            treeNode.sons.push(_list_iter());
        }
        return treeNode;
    }

    function _old_test() {
        var treeNode = new treeNodeClass();
        treeNode.type = "OLD_TEST";
        treeNode.sons.push(_or_test()); 
        return treeNode;
    }

    function _comp_for() {
        var treeNode = new treeNodeClass();
        treeNode.type = "COMP_FOR";
        _match("FOR");
        treeNode.sons.push(_exprlist());
        _match("IN");
        treeNode.sons.push(_or_test());
        if (currentToken.type == "FOR" || currentToken.type == "IF") {
            treeNode.sons.push(_comp_iter());
        }
        return treeNode;
    }

    function _comp_if() {
        var treeNode = new treeNodeClass();
        treeNode.type = "COMP_IF";
        _match("IF");
        treeNode.sons.push(_old_test());
        if (currentToken.type == "FOR" || currentToken.type == "IF") {
            treeNode.sons.push(_comp_iter());
        }
        return treeNode;
    }

    function _comp_iter() {
        var treeNode = new treeNodeClass();
        treeNode.type = "COMP_ITER";
        if (currentToken.type == "FOR") {
            treeNode.sons.push(_comp_for());
        } else if (currentToken.type == "IF") {
            treeNode.sons.push(_comp_if());
        }
        return treeNode;
    }



}


