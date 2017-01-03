//string,ident,number,op,keywords,dic,list,tuple,bool,null


exports.SActiveRecord = function(){   
    this.name = "";
    this.return_value = null;
    this.outFunction = null;
    this.allEntry = new Array(); //[SObject,SObject...new Sfunction,new SClass]
    this.toString=function(){
        ret = "{";
        for (i in this.allEntry){
            ret = ret + this.allEntry[i].toString() + "," ;
        }
        return ret.substring(0,ret.length-1)  + "}";
    }
    this.printEntry=function(){
        ret = "Layer: "+this.name+"\n| Type \t\t|Name \t\t|Value \t\t|\n"
        ret += "-------------------------------------------------\n";
        for (var item in this.allEntry) {
            if ((item!="contains_key") && (item!="contains_value"))
                ret += "| " + this.allEntry[item].type + "\t|" + this.allEntry[item].name + "\t\t|" + this.allEntry[item].value + "\t|\n"; 
        }
        ret += "-------------------------------------------------";
        return ret;
    }
    this.getEntryLength=function() {
        var len = 0;
        for (var item in this.allEntry) {
            if ((item!="contains_key") && (item!="contains_value"))
                len+=1;
        }
        return len;
    }
}

exports.SObject = function(){ 
    this.type="";//Number,String,List,Dictionary,Tuple,Boolean,Char
    this.name="";
    this.value=null;
    this.toString=function(){       
        if (this.name.length> 0){
            ret = "{" + this.type+"  "+this.name+": "+this.value+ "}";
            return ret;
        }
        else{
            ret = "{ }"
            return ret;
        }
    }
}

exports.SClass = function(){ 
    this.allEntry = new Array();//[SObject,Sobject,SFunction...],属性：SObject，方法：SFunction
    this.type="Class" ;//class,number,string,function
    this.name=""
    this.father = new Array();
    this.ast = null;
    /*
    this.toString=function(){
        ret = "Class{"
        if (this.allEntry.length > 0){
            ret += "\n";
        }
        for (i in this.allEntry){
            ret = ret +  this.allEntry[i].toString() + "," ;
        }
        return ret.substring(0,ret.length-1) + "}";
    }
    */
    this.printEntry=function(){
        ret = "Class: "+this.name+"\n| Type \t\t|Name \t\t|Value \t\t|\n"
        ret += "-------------------------------------------------\n";
        for (var item in this.allEntry) {
            if ((item!="contains_key") && (item!="contains_value"))
                ret += "| " + this.allEntry[item].type + "\t|" + this.allEntry[item].name + "\t\t|" + this.allEntry[item].value + "\t|\n"; 
        }
        ret += "-------------------------------------------------";
        return ret;
    }
    this.getEntryLength=function() {
        var len = 0;
        for (var item in this.allEntry) {
            if ((item!="contains_key") && (item!="contains_value"))
                len+=1;
        }
        return len;
    }
}

exports.SNull = function(){ 
    this.toString=function(){
        return "NULL";
    }
}

exports.SNone = function(){ 
    this.toString=function(){
        return "NONE";
    }
}

    //只有1个实例
exports.None= this.SNone();
exports.Null = this.SNull();


exports.SFunction = function(){
    this.allEntry = new Array();//[SObject,Sobject,SFunction...] 局部变量
    this.name = "";
    this.ast = null;
    this.argument_list = [];
    this.outFunction = null;
    this.return_value = null;
    /*
    this.toString=function(){
        ret = "function " + this.name;
        ret += "("
        if (this.argument_list.length > 0 ){
            ret += this.argument_list[0];
            for (i in range(1, this.argument_list.length)){
                ret += ", " + this.argument_list[i];
            }
        }
        ret += ")";
        // ret += StFunction.code(this.ast);
        return ret;
    }
    */
}

        // this.code=function(code){
        //     if not isinstance(code, list):
        //         return code.__str__()
        //     ret = ""
        //     if len(code) == 2:
        //         return StFunction.code(code[1])
        //     else:
        //         for i in range(1, len(code)):
        //             child = StFunction.code(code[i])
        //             ret += child
        //             if i != len(code) - 1:
        //                 ret += " "
        //         return ret
        // }

    //}