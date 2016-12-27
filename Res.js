/*
Res function set : Yin Huang & Peng
*/

exports.RES_or_test = function(array) {
    args_num=array.length;
    if(args_num>0){
        for (i=0;i<args_num;i++){
            if(array[i].type=="Identity" || array[i].type=="Option")
                console.log("RES_or_test Error:type error");
            if((array[i].type=="Boolean" && array[i].value==true) || (array[i].type!="Boolean" && array[i].value != null))
                break;
        }
        if(i==args_num){
            temp=new SObject.SObject();
            temp.type="Boolean";
            temp.value=false;
            return temp
        }
        else{
            temp=new SObject.SObject();
            temp.type=array[i].type;
            temp.value=array[i].value;
            return temp             
        }
    }   
    else 
        console.log("RES_or_test Error:null array");
}

exports.RES_and_test = function(array) {
    args_num=array.length;
    if(args_num>0){
        for (i=0;i<args_num;i++){
            if(array[i].type=="Identity" || array[i].type=="Option")
                console.log("RES_and_test Error:type error");
            if((array[i].type=="Boolean" && array[i].value==false) || (array[i].type!="Boolean" && array[i].value == null))
                break;
            if(array[i].type in ["String","List","Dictionary","Tuple"] && array[i].value.length ==0)
                break;
        }
        if(i==args_num){
            temp=new SObject.SObject();
            temp.type="Boolean";
            temp.value=true;
            return temp
        }
        else{
            temp=new SObject.SObject();
            temp.type=array[i].type;
            temp.value=array[i].value;
            return temp             
        }
    }   
    else 
        console.log("RES_and_test Error:null array");
}

exports.RES_not_test = function(arg) {
    temp=new SObject.SObject();
    temp.type="Boolean";
    if(arg.type=="Identity" || arg.type=="Option")
        console.log("RES_or_test Error:type error");
    else if((arg.type=="Boolean" && arg.value==false) || (arg.type!="Boolean" && arg.value == null))
        temp.value=true;
    else if(arg.type in ["String","List","Dictionary","Tuple"] && arg.value.length ==0)
        temp.value=true;
    else
        temp.value=false;
    return temp;
}

//is 未实现
//comparison: expr (comp_op expr)*
//comp_op: '<'|'>'|'=='|'>='|'<='|'<>'|'!='|'in'|'is'
exports.RES_comparison = function(array) {

    function one_RES_comparison(arg1,op,arg2){
        if (arg1.type==arg2.type && (arg1.type="Char" || arg1.type="Tuple" || arg1.type=="Boolean" || arg1.type=="Number" || arg1.type=="String" || arg1.type=="List") {
            if (op.value == "<") {              
                return arg1.value<arg2.value;
            }
            else if (op.value == ">") {              
                return arg1.value>arg2.value;
            }
            else if (op.value == "==") {              
                return arg1.value==arg2.value;
            }
            else if (op.value == ">=") {              
                return arg1.value>=arg2.value;
            }
            else if (op.value == "<=") {              
                return arg1.value<=arg2.value;
            }
            else if (op.value == "<>") {              
                return arg1.value!=arg2.value ;
            }
            else if (op.value == "!=") {              
                return arg1.value!=arg2.value;
            }
            else {
                console.log("one_RES_comparison Error1:no such option");
            }
        else if (arg1.type=="Char" && arg2.type=="String" && op.value == "in") {            
            return (arg2.value.indexOf(arg1.value) >= 0 ) ;
        else if ((arg2.type=="List" || arg2.type=="Tuple") && op.value == "in") {            
            return arg2.value.contains_value(arg1.value) ;
        else if ((arg2.type=="Dictionary") && op.value == "in") {            
            return arg2.value.contains_key(arg1.value) ;
        else 
            console.log("one_RES_comparison Error2:no such match");
    }

    args_num=(array.length+1)/2;
    res=true;
    if (args_num==1){
        res=(res && array[0].value);
    }
    else if (args_num>1){
        for (i=0;i<args_num-1;i++){
            res=(res && one_RES_comparison(array[i*2],array[i*2+1],array[i*2+2]));
        }      
    }
    else 
        console.log("RES_comparison Error:null array");

    temp=new SObject.SObject();
    temp.type="Boolean";
    temp.value=res;
    return temp
}

//expr: xor_expr ('|' xor_expr)*
exports.RES_expr = function(array) {

    function one_RES_expr(arg1,arg2){
        if ((arg1.type=="Number" || arg1.type=="Boolean") && (arg2.type=="Number" || arg2.type=="Boolean")) {
            arg1.value=arg1.value | arg2.value
            return arg1;
        else 
            console.log("one_RES_expr Error:type error");
    }

    args_num=array.length;
    if(args_num>0){
        temp=new SObject.SObject();
        temp.type=array[0].type;
        temp.value=array[0].value;
        for (i=1;i<args_num-1;i++){
            one_RES_expr(temp,array[i]);
        }
        temp.type=="Number"
        return temp
    }   
    else 
        console.log("RES_expr Error:null array");
}

// xor_expr: and_expr ('^' and_expr)*
exports.RES_xor_expr = function(array) {

    function one_RES_xor_expr(arg1,arg2){
        if ((arg1.type=="Number" || arg1.type=="Boolean") && (arg2.type=="Number" || arg2.type=="Boolean")) {
            arg1.value=arg1.value ^ arg2.value
            return arg1;
        else 
            console.log("one_RES_xor_expr Error:type error");
    }

    args_num=array.length;
    if(args_num>0){
        temp=new SObject.SObject();
        temp.type=array[0].type;
        temp.value=array[0].value;
        for (i=1;i<args_num-1;i++){
            one_RES_xor_expr(temp,array[i]);
        }
        temp.type=="Number"
        return temp
    }   
    else 
        console.log("RES_xor_expr Error:null array");
}

//shift_expr: arith_expr (('<<'|'>>') arith_expr)*
exports.RES_shift_expr = function(array) {

    function one_RES_shift_expr(arg1,op,arg2){
        if ((arg1.type=="Number" || arg1.type=="Boolean") && (arg2.type=="Number" || arg2.type=="Boolean")) {
            if (op.value == "<<") {
                arg1.value=arg1.value<<arg2.value;
                return arg1
            }
            else if(op.value == ">>"){
                arg1.value=arg1.value>>arg2.value;
                return arg1
            } 
            else 
                console.log("one_RES_shift_expr Error:option error");
        else 
            console.log("one_RES_shift_expr Error:type error");
    }

    args_num=(array.length+1)/2;
    if(args_num>0){
        temp=new SObject.SObject();
        temp.type=array[0].type;
        temp.value=array[0].value;
        for (i=1;i<args_num-1;i++){
            one_RES_shift_expr(temp,array[i*2-1],array[i*2]);
        }
        temp.type=="Number"
        return temp
    }   
    else 
        console.log("RES_shift_expr Error:null array");
}

// arith_expr: term (('+'|'-') term)*
exports.RES_arith_expr = function(array) {

    function one_RES_arith_expr(arg1,op,arg2){
        if ((arg1.type=="Number" || arg1.type=="Boolean") && (arg2.type=="Number" || arg2.type=="Boolean")) {
            if (op.value == "+") {
                arg1.value=arg1.value+arg2.value;
                return arg1
            }
            else if(op.value == "-"){
                arg1.value=arg1.value-arg2.value;
                return arg1
            } 
            else 
                console.log("one_RES_arith_expr Error1:option error");
        else if (arg1.type==arg2.type && (arg1.type=="String" || arg1.type=="List" || arg1.type=="Tuple")) {
            if (op.value == "+") {
                arg1.value=arg1.value+arg2.value;
                return arg1
            }
            else 
                console.log("one_RES_arith_expr Error2:option error");         
        else 
            console.log("one_RES_arith_expr Error:type error");
    }

    args_num=(array.length+1)/2;
    if(args_num>0){
        temp=new SObject.SObject();
        temp.type=array[0].type;
        temp.value=array[0].value;
        for (i=1;i<args_num-1;i++){
            one_RES_arith_expr(temp,array[i*2-1],array[i*2]);
        }
        if (temp.type=="Boolean"){
            temp.type=="Number"             
        }
        return temp
    }   
    else 
        console.log("RES_arith_expr Error:null array");
}

// term: factor (('*'|'/'|'%'|'//') factor)*
exports.RES_term = function(array) {

    function one_RES_term(arg1,op,arg2){
        if ((arg1.type=="Number" || arg1.type=="Boolean") && (arg2.type=="Number" || arg2.type=="Boolean")) {
            if (op.value == "*") {
                arg1.value=arg1.value*arg2.value;
                return arg1
            }
            else if(op.value == "/"){
                arg1.value=arg1.value / arg2.value;
                return arg1
            } 
            else if(op.value == "%"){
                arg1.value=arg1.value % arg2.value;
                return arg1
            } 
            else if(op.value == "//"){
                arg1.value=parseInt(arg1.value / arg2.value);
                return arg1
            }            
            else 
                console.log("one_RES_term Error:option error");
        else 
            console.log("one_RES_term Error:type error");
    }

    args_num=(array.length+1)/2;
    if(args_num>0){
        temp=new SObject.SObject();
        temp.type=array[0].type;
        temp.value=array[0].value;
        for (i=1;i<args_num-1;i++){
            one_RES_term(temp,array[i*2-1],array[i*2]);
        }
        temp.type=="Number"
        return temp
    }   
    else 
        console.log("RES_term Error:null array");
}

// factor: ('+'|'-'|'~') factor | power
exports.RES_factor = function(op,arg) {
    temp=new SObject.SObject();
    temp.type="Number";
    if(arg.type=="Number")
        temp.value=arg.value;
    else if(arg.type=="Boolean" && arg.value==true)
        temp.value=1;
    else if (arg.type=="Boolean" && arg.value==false)
        temp.value=0;
    else
         console.log("RES_factor Error:type error");
    
    if (op.value == "+") {
        temp.value=temp.value;
        return temp;
    }
    else if (op.value == "-") {
        temp.value=-temp.value;
        return temp;
    }
    else if (op.value == "~") {
        temp.value= ~temp.value;
        return temp;
    }
    else 
        console.log("RES_factor Error:option error");
    }
}