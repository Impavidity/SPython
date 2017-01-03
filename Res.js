/*
Res function set : Yin Huang & Peng
*/
var SObject = require("./Object");
/*
Array.prototype.contains_value = function (element) { 
    for (var i = 0; i < this.length; i++) { 
        if (this[i] == element) { 
        return true; 
        } 
    } 
    return false; 
} 
Array.prototype.contains_key = function (element) { 
    for (var i in this) { 
        if (i == element) { 
        return true; 
        } 
    } 
    return false; 
} 
*/

// or_test: and_test ('or' and_test)*
exports.RES_or_test = function(array) {
    args_num=array.length;
    /*Implemented by Peng*/
    if (args_num == 1) {
        return array[0];
    }
    /**/
    if(args_num>0){
        for (i=0;i<args_num;i++){
            if(array[i].type=="Identity" || array[i].type=="Option")
                console.log("RES_or_test Error:type error");
            if((array[i].type=="Boolean" && array[i].value==true) || (array[i].type!="Boolean" && array[i].value != null))
                break;
        }
        // console.log(i);
        if(i==args_num){
            temp=array[i-1].copy();
            temp.name="";
            return temp;
        }
        else{
            temp=array[i].copy();
            temp.name="";
            return temp;
        }
    }   
    else 
        console.log("RES_or_test Error:null array");
}

exports.RES_and_test = function(array) {
    args_num=array.length;
    /*Implemented by Peng*/
    if (args_num == 1) {
        return array[0];
    }
    /**/
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
            temp=array[i-1].copy();
            temp.name="";
            return temp; 
        }
        else{
            temp=array[i].copy();
            temp.name="";
            return temp;             
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
        if (arg1.type==arg2.type && 
            (arg1.type=="Char" || arg1.type=="Tuple" || 
             arg1.type=="Boolean" || arg1.type=="Number" || 
             arg1.type=="String" || arg1.type=="List")) {
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
        } else if (arg1.type=="Char" && arg2.type=="String" && op.value == "in") {            
            return (arg2.value.indexOf(arg1.value) >= 0 ) ;
        } else if ((arg2.type=="List" || arg2.type=="Tuple") && op.value == "in") {            
            return (arg2.value.indexOf(arg1.value)!=-1) ;
        } else if ((arg2.type=="Dictionary") && op.value == "in") {            
            return (arg2.value[arg1.value]!=undefined) ;
        } else {
            console.log("one_RES_comparison Error2:no such match");
        }
    }

    /*Implemented by Peng*/
    if (array.length == 1) {
        return array[0];
    }
    /**/

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
    return temp;
}

//expr: xor_expr ('|' xor_expr)*
exports.RES_expr = function(array) {
    if (array.length==1)
        return array[0];

    function one_RES_expr(arg1,arg2){
        if ((arg1.type=="Number" || arg1.type=="Boolean") && (arg2.type=="Number" || arg2.type=="Boolean")) {
            arg1.value=arg1.value | arg2.value
            return arg1;
        } else {
            console.log("one_RES_expr Error:type error");
        }
    }

    args_num=array.length;
    if(args_num>0){
        temp=array[0].copy();
        temp.name="";
        for (i=1;i<args_num;i++){
            one_RES_expr(temp,array[i]);
        }
        temp.type=="Number";
        return temp;
    }   
    else 
        console.log("RES_expr Error:null array");
}

// xor_expr: and_expr ('^' and_expr)*
exports.RES_xor_expr = function(array) {
    if (array.length==1)
        return array[0];

    function one_RES_xor_expr(arg1,arg2){
        if ((arg1.type=="Number" || arg1.type=="Boolean") && (arg2.type=="Number" || arg2.type=="Boolean")) {
            arg1.value=arg1.value ^ arg2.value;
            return arg1;
        } else {
            console.log("one_RES_xor_expr Error:type error");
        }
    }

    args_num=array.length;
    if(args_num>0){
        temp=array[0].copy();
        temp.name="";
        for (i=1;i<args_num;i++){
            one_RES_xor_expr(temp,array[i]);
        }
        temp.type=="Number";
        return temp;
    }   
    else 
        console.log("RES_xor_expr Error:null array");
}

//shift_expr: arith_expr (('<<'|'>>') arith_expr)*
exports.RES_shift_expr = function(array) {
    if (array.length==1)
        return array[0];

    function one_RES_shift_expr(arg1,op,arg2){
        if ((arg1.type=="Number" || arg1.type=="Boolean") && (arg2.type=="Number" || arg2.type=="Boolean")) {
            if (op.value == "<<") {
                arg1.value=arg1.value<<arg2.value;
                return arg1;
            } else if(op.value == ">>"){
                arg1.value=arg1.value>>arg2.value;
                return arg1;
            } else { 
                console.log("one_RES_shift_expr Error:option error");
            }
        } else {
            console.log("one_RES_shift_expr Error:type error");
        }
    }

    args_num=(array.length+1)/2;
    if(args_num>0){
        temp=array[0].copy();
        temp.name="";
        for (i=1;i<args_num;i++){
            one_RES_shift_expr(temp,array[i*2-1],array[i*2]);
        }
        temp.type=="Number";
        return temp;
    }   
    else 
        console.log("RES_shift_expr Error:null array");
}

// arith_expr: term (('+'|'-') term)*
exports.RES_arith_expr = function(array) {
    if (array.length==1)
        return array[0];

    function one_RES_arith_expr(arg1,op,arg2){
        if ((arg1.type=="Number" || arg1.type=="Boolean") && (arg2.type=="Number" || arg2.type=="Boolean")) {
            if (op.value == "+") {
                arg1.value=arg1.value+arg2.value;
                return arg1;
            } else if(op.value == "-"){
                arg1.value=arg1.value-arg2.value;
                return arg1;
            } else {
                console.log("one_RES_arith_expr Error1:option error");
            }
        } else if (arg1.type==arg2.type && (arg1.type=="String" || arg1.type=="List" || arg1.type=="Tuple")) {
            if (op.value == "+") {
                arg1.value=arg1.value+arg2.value;
                return arg1;
            } else {
                console.log("one_RES_arith_expr Error2:option error");
            }
        } else {
            console.log("one_RES_arith_expr Error:type error");
        }
    }

    args_num=(array.length+1)/2;
    if(args_num>0){
        temp=array[0].copy();
        temp.name="";
        for (i=1;i<args_num;i++){
            one_RES_arith_expr(temp,array[i*2-1],array[i*2]);
            console.log("Calculation");
            console.log(temp);
        }
        if (temp.type=="Boolean"){
            temp.type=="Number";             
        }
        return temp;
    }   
    else 
        console.log("RES_arith_expr Error:null array");
}

// term: factor (('*'|'/'|'%'|'//') factor)*
exports.RES_term = function(array) {
    if (array.length == 1)
        return array[0];

    function one_RES_term(arg1,op,arg2){
        if ((arg1.type=="Number" || arg1.type=="Boolean") && (arg2.type=="Number" || arg2.type=="Boolean")) {
            if (op.value == "*") {
                arg1.value=arg1.value*arg2.value;
                return arg1;
            } else if(op.value == "/"){
                arg1.value=arg1.value / arg2.value;
                return arg1;
            } else if(op.value == "%"){
                arg1.value=arg1.value % arg2.value;
                return arg1;
            }  else if(op.value == "//"){
                arg1.value=parseInt(arg1.value / arg2.value);
                return arg1;
            } else {
                console.log("one_RES_term Error:option error");
            }
        } else {
            console.log("one_RES_term Error:type error");
        }
    }

    args_num=(array.length+1)/2;
    if(args_num>0){
        temp=array[0].copy();
        temp.name="";
        for (i=1;i<args_num;i++){
            one_RES_term(temp,array[i*2-1],array[i*2]);
        }
        temp.type=="Number";
        return temp;
    }   
    else 
        console.log("RES_term Error:null array");
}

// factor: ('+'|'-'|'~') factor | power
exports.RES_factor = function(args) {
    var op;
    var arg;
    if (args.length == 2) {
        op = args[0];
        arg = args[1];
    } else if (args.length == 1){
        arg = args[0];
    }
    if (arg.type == "Identity") {
        return arg;
    }
    var temp = new SObject.SObject();
    temp.type="Number";
    temp.name=arg.name;
    if(arg.type=="Number")
        temp.value=arg.value;
    else if(arg.type=="Boolean" && arg.value==true)
        temp.value=1;
    else if (arg.type=="Boolean" && arg.value==false)
        temp.value=0;
    else if (arg.type=="String") {
        temp.value=arg.value;
        temp.type="String";
    } else if (arg.type=="Func") {
        temp.value=arg.value;
        temp.type="Func";
    } else 
        console.log("RES_factor Error:type error : "+arg.type);

    if (op != undefined) {
        if (temp.type=="String") {
            console.log("The type of the value is String and Can not do the operation");
            return temp;
        }
        else if (op.value == "+") {
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
        else {
            console.log("RES_factor Error:option error");
        }
    }
    return temp;
}

//and_expr: shift_expr ('&' shift_expr)*
exports.RES_and_expr = function(array) {
    if (array.length==1)
        return array[0];

    function one_RES_and_expr(arg1,arg2){
        if ((arg1.type=="Number" || arg1.type=="Boolean") && (arg2.type=="Number" || arg2.type=="Boolean")) {
            arg1.value=arg1.value & arg2.value;
            return arg1;
        }
        else {
            console.log("one_RES_and_expr Error:type error");
        }
    }

    args_num=array.length;
    if(args_num>0){
        temp=array[0].copy();
        temp.name="";
        for (i=1;i<args_num;i++){
            one_RES_and_expr(temp,array[i]);
        }
        temp.type=="Number";
        return temp;
    }   
    else 
        console.log("RES_and_expr Error:null array");
}

// expr_stmt: testlist augassign testlist | testlist '=' testlist
// augassign: ('+=' | '-=' | '*=' | '/=' | '%=' | '&=' | '|=' | '^=' | '<<=' | '>>=' | '**=' | '//=')
this.RES_expr_stmt = function(arg1,op,arg2,context) {
    var temp=SObject.SObject();
    if (op.value == "=") {
        //If it is assignment : Implement by Peng
        if (arg1.length != arg2.length) {
            console.log("RES_expr_stmt Error:The number of values is not the same");
        }
        var temp_args = new Array();
        for (var i=0; i<arg2.length; i++) {
            temp_args.push(arg2[i].copy());
        }
        for (var i=0; i<arg1.length; i++) { 
            if(temp_args[i].type=="Identity")
                    console.log("RES_expr_stmt Error:Identity not defined");
            else{ 
                if( arg1[i].ismember==1 || arg1[i].ismember==32){
                    arg1[i].value = temp_args[i].value;
                    arg1[i].type = temp_args[i].type;
                }
                else if(arg1[i].type=="Identity"){//not context.allEntry.contains_key(arg1[i].name)
                    arg1[i].value = temp_args[i].value;
                    arg1[i].type = temp_args[i].type;
                    arg1[i].ismember = temp_args[i].ismember;
                    context.allEntry[arg1[i].name] = arg1[i];
                    console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD");
                    console.log(context.allEntry[arg1[i].name]);    
                    console.log(context.printEntry());            
                }
                else if (arg1[i].value!=null) {//context.allEntry.contains_key(arg1[i].name)
                    arg1[i].value = temp_args[i].value;
                    arg1[i].type = temp_args[i].type;
                    arg1[i].ismember = temp_args[i].ismember;
                    context.allEntry[arg1[i].name] = arg1[i]; 
                } 
                else {
                    console.log("RES_expr_stmt Error:other error");
                }                                
            }
        }
        return arg1;

    } else {
        // Reimplement by Peng
        if (arg1.length != arg2.length) {
            console.log("The number of values is not the same");
        }
        for (var i=0; i<arg1.length; i++) {
            var temp_arg1 = arg1[i];
            var temp_arg2 = arg2[i];
            if ((temp_arg1.type=="Number" || temp_arg1.type=="Boolean") && (temp_arg2.type=="Number" || temp_arg2.type=="Boolean")) {
                temp_arg1.type="Number";
                if (op.value == "+=") {
                    temp_arg1.value=temp_arg1.value+temp_arg2.value;   
                }
                else if(op.value == "-="){
                    temp_arg1.value=temp_arg1.value-temp_arg2.value;
                } 
                else if(op.value == "*="){
                    temp_arg1.value=temp_arg1.value*temp_arg2.value;
                } 
                else if(op.value == "/="){
                    temp_arg1.value=temp_arg1.value / temp_arg2.value;
                } 
                else if(op.value == "%="){
                    temp_arg1.value=temp_arg1.value % temp_arg2.value;
                } 
                else if(op.value == "|="){
                    temp_arg1.value=temp_arg1.value | temp_arg2.value;
                }               
                 else if(op.value == "^="){
                    temp_arg1.value=temp_arg1.value ^ temp_arg2.value;
                } 
                else if(op.value == "<<="){
                    temp_arg1.value=temp_arg1.value << temp_arg2.value;
                } 
                else if(op.value == ">>="){
                    temp_arg1.value=temp_arg1.value >> temp_arg2.value;
                } 
                else if(op.value == "**="){
                    temp_arg1.value=Math.pow(temp_arg1.value,temp_arg2.value)//Math!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                } 
                else if(op.value == "//="){
                    temp_arg1.value=parseInt(temp_arg1.value / temp_arg2.value);
                }  
                else {
                    console.log("RES_expr_stmt Error:no such option ");
                    process.exit(0);
                }

            }
            else if (temp_arg1.type==temp_arg2.type && temp_arg1.type=="String") {
                if (op.value == "+=") {
                    temp_arg1.value=temp_arg1.value+temp_arg2.value;
                }
                else {
                    console.log("RES_expr_stmt Error:String only support += ");
                    process.exit(0);
                }
            }
            else if (temp_arg1.type==temp_arg2.type && temp_arg1.type=="List") {
                if (op.value == "+=") {
                    temp_arg1.value=temp_arg1.value+temp_arg2.value;
                }
                else {
                    console.log("RES_expr_stmt Error:String only support += ");
                    process.exit(0);
                }
            }
            else{
                if (! context.allEntry[arg1[i].name]!=undefined) {
                    console.log("Value Error : " + arg1[i].name + " is not defined");
                } else {
                    console.log("RES_expr_stmt Error :args type not same OR type not support the option");
                }
                process.exit(0);
            }
            if (context.allEntry[arg1[i].name]!=undefined) {
                context.allEntry[arg1[i].name] = arg1[i];
            }
        }
        return arg1;
    }
}

RES_argument = function(item,context, paracount, argument_list) {
    console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
    console.log(argument_list);
    console.log(item.name);
    if (item.name != "_un_assigned_") {
        context.allEntry[item.name] = item;
    } else {
        item.name = argument_list[paracount-1].name;
        context.allEntry[argument_list[paracount-1].name] = item;

    }
}

exports.RES_power = function(array, context) {
    
    function one_RES_power(arg1,arg2){
        if(arg2.type=="NAME"){

        }
        else if(arg2.type=="ARGLIST"){

        }
        else if(arg2.type=="SUBSCRIPTLIST"){
            if(arg1.type=="List" || arg1.type=="Tuple"){
                var temp=new SObject.SObject();
                temp.type=arg1.type;
                var temp_value= new Array();
                //arg2.value只认为第一个有效
                step=arg2.value[0][2];
                start=arg2.value[0][0];
                end=arg2.value[0][1];
                
                if(step==0)
                    console.log("one_RES_power Error:step can't be zero");   
                else if(step>0){
                    if(start==null){
                        start=0;                
                    }
                    else if(start<0){
                        start=arg1.value.length+start;
                    }

                    if(end==null){
                        end=arg1.value.length-1;                
                    }
                    else if(end<0){
                        end=arg1.value.length+end;
                        end=end-1;
                    }
                    else if(end>0){
                            end=end-1;
                    } 
                    if(arg2.value[0][3]=="loc"){
                        if( start>=arg1.value.length)
                            console.log("one_RES_power Error:list index out of index");
                        else{
                            //temp=arg1.value[start].copy();
                            temp=arg1.value[start];
                            temp.name="";
                            console.log("999999999999999999999999999999999999999999");
                            console.log(temp);
                            console.log("999999999999999999999999999999999999999999");
                        }
                    }
                    else if(arg2.value[0][3]=="slice"){
                        if( start>=arg1.value.length || start>end )
                            temp.value=temp_value;
                        else{
                            for (var i=start;i<=end;i=i+step){
                                //temp_value.push(arg1.value[i].copy());
                                temp_value.push(arg1.value[i]);
                            }
                            temp.value=temp_value;
                        }
                    }
                    return temp;
                }
                else{//step<0
                    if(start==null){
                        start=arg1.value.length-1;                
                    }
                    else if(start<0){
                        start=arg1.value.length+start;
                    }

                    if(end==null){
                        end=0;                
                    }
                    else if(end<0){
                        end=arg1.value.length+end;
                        end=end+1;
                    }
                    else if(end>0){
                            end=end+1;
                    } 
                    if(arg2.value[0][3]=="loc"){
                        if( start>=arg1.value.length)
                            console.log("one_RES_power Error:list index out of index");
                        else{
                            // temp=arg1.value[start].copy();
                            temp=arg1.value[start];
                            temp.name="";
                        }
                    }
                    else if(arg2.value[0][3]=="slice"){
                        if( end>=arg1.value.length || start<end )
                            temp.value=temp_value;
                        else{
                            for (var i=start;i>=end;i=i+step){
                                // temp_value.push(arg1.value[i].copy());
                                temp_value.push(arg1.value[i]);
                            }
                            temp.value=temp_value;
                        }
                    }    
                    return temp;            
                }                
            }
            else if(arg1.type=="String"){
                var temp=new SObject.SObject();
                temp.type=arg1.type;
                var temp_value= "";
                //arg2.value只认为第一个有效
                step=arg2.value[0][2];
                start=arg2.value[0][0];
                end=arg2.value[0][1];
                
                if(step==0)
                    console.log("one_RES_power Error:step can't be zero");   
                else if(step>0){
                    if(start==null){
                        start=0;                
                    }
                    else if(start<0){
                        start=arg1.value.length+start;
                    }

                    if(end==null){
                        end=arg1.value.length-1;                
                    }
                    else if(end<0){
                        end=arg1.value.length+end;
                        end=end-1;
                    }
                    else if(end>0){
                            end=end-1;
                    } 
                    if(arg2.value[0][3]=="loc"){
                        if( start>=arg1.value.length)
                            console.log("one_RES_power Error:list index out of index");
                        else{
                            temp.value=arg1.value[start];
                            temp.type="Char";
                            temp.ismember=0;
                        }
                    }
                    else if(arg2.value[0][3]=="slice"){
                        if( start>=arg1.value.length || start>end )
                            temp.value=temp_value;
                        else{
                            for (var i=start;i<=end;i=i+step){
                                temp_value+=arg1.value[i];
                            }
                            temp.value=temp_value;
                        }
                    }
                    return temp;
                }
                else{//step<0
                    if(start==null){
                        start=arg1.value.length-1;                
                    }
                    else if(start<0){
                        start=arg1.value.length+start;
                    }

                    if(end==null){
                        end=0;                
                    }
                    else if(end<0){
                        end=arg1.value.length+end;
                        end=end+1;
                    }
                    else if(end>0){
                            end=end+1;
                    } 
                    if(arg2.value[0][3]=="loc"){
                        if( start>=arg1.value.length)
                            console.log("one_RES_power Error:list index out of index");
                        else{
                            temp.value=arg1.value[start];
                            temp.type="Char";
                            temp.ismember=0;
                        }
                    }
                    else if(arg2.value[0][3]=="slice"){
                        if( end>=arg1.value.length || start<end )
                            temp.value=temp_value;
                        else{
                            for (var i=start;i>=end;i=i-step){
                                temp_value+=arg1.value[i];
                            }
                            temp.value=temp_value;
                        }
                    }    
                    return temp;              
                }                
            }
            else if(arg1.type=="Dictionary"){
                var temp=new SObject.SObject();
                if(arg2.value[0][3]!="loc")
                    console.log("one_RES_power Error:dic can only loc");  
                else{
                    //arg2.value只认为第一个有效
                    key=arg2.value[0][0];
                    if (typeof key == "string") key = "S_"+key;
                    else if (typeof key == "number") key = "N_"+key;
                    // temp=arg1.value[key].copy();
                    temp=arg1.value[key];
                    temp.name="";
                    return temp;
                }
            }
        }
        else{//**
            var temp=new SObject.SObject();
            temp.type="Number";
            console.log("888888888888888888888888888888888888");
            console.log(arg1);
            console.log(arg2);
            console.log("888888888888888888888888888888888888");
            if ((arg1.type=="Number" || arg1.type=="Boolean") && (arg2.type=="Number" || arg2.type=="Boolean")) {
                temp.value=Math.pow(arg1.value,arg2.value);
                return temp;
            }
        }
                
    }

    function get_method(op1,op2,context) {
        if (op1.type == "Class" && (op2.type=="NAME" ||  op2.type=="ARGLIST") ) {

        } else if (op1.type == "Func") {

            if (op2.type == "ARGLIST") {
                var subcontext = new SObject.SActiveRecord();
                subcontext.outFunction = context;
                console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
                console.log(op2);
                var paracount = 0;
                for (var i=0;i<op2.value.length;i++) {
                    console.log("OP2 value : "+op2.value[i].type);
                    
                    if (op2.value[i].type == "*") {
                        paracount += 1;
                        RES_oneStarArgument(op2.value[i+1],subcontext, paracount, op1.value.argument_list);
                        i += 1;
                    }
                    else if (op2.value[i].type == "**") {
                        paracount += 1;
                        RES_twoStarArgument(op2.value[i+1],subcontext, paracount, op1.value.argument_list);
                        i += 1;
                    } else {
                        paracount += 1;
                        RES_argument(op2.value[i],subcontext, paracount, op1.value.argument_list);
                    }
                } 
                console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL");
                console.log(op1.value.ast);
                console.log(subcontext.printEntry());
                subcontext.name = op1.value.name;
                global.engine._exec_func_out(op1.value.ast,subcontext);
                var result = subcontext.return_value;
                console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPPP");
                console.log(result);
            }
        }
        return result;
    }

    args_num=array.length;
    if(args_num>0){
        temp=array[0].copy();
        temp.name="";
        for (i=1;i<args_num;i++){
            if(temp.type == "Class"){
                /*
                temp = context.allEntry[arg1.name];
                for (var i=1; i<array.length; i++) {
                    if (array[i].type == "NAME") {
                        var name = array[i].name;
                        if (temp.value.allEntry[name]!=undefined) {
                            temp = temp.value.allEntry[name];    
                        } else {
                            console.log("Error : The class does not have " + name + " method");
                            process.exit(0);
                        }
                    } else if (array[i].type == "ARGLIST") {
                        for (var arg in array[i].sons) {

                        }
                    }
                    
                }
                */
            } else if (temp.type == "Func") {
                console.log("AAAAAAAAAAAAAAAAAAAAa");
                console.log(array);
                // for (var i=1; i<array.length; i++) {
                //     console.log("iiiiiiiiiiiiiiiiiiiiiiiiii");
                //     console.log(temp);
                //     console.log(array[i]);
                //     console.log("iiiiiiiiiiiiiiiiiiiiiiiiii");
                temp = get_method(temp,array[i],context);
                if (temp.length > 1) console.log("Can not return several value");
                temp = temp[0];
                console.log("RRRRRRRRRRRR Result of POWER");
                console.log(temp);
                console.log("RRRRRRRRRRRRRR");
            }
            else {
                temp = one_RES_power(temp,array[i]);
            }
        }
        //temp.type=="Number";
        console.log(temp);
        console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
        return temp;
    }   
    else 
        console.log("RES_power Error:null array");

}
