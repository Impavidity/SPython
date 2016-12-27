//string,ident,number,op,keywords,dic,list,tuple,bool,null
module.exports = BaseObject;
function BaseObject() {
    this.SActiveRecord = function(){   
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
    }

    this.SObject = function(){ 
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

    this.SClass = function(){ 
        this.allEntry = new Array();//[SObject,Sobject,SFunction...],属性：SObject，方法：SFunction
        this.type="Class" ;//class,number,string,function
        this.name=""
        this.toString=function(){
            ret = "Class{"
            if (len(this.allEntry) > 0){
                ret += "\n";
            }
            for (i in this.allEntry){
                ret = ret +  this.allEntry[i].toString() + "," ;
            }
            return ret.substring(0,ret.length-1) + "}";
        }
    }

    this.SNull = function(){ 
        this.toString=function(){
            return "NULL";
        }
    }

    this.SNone = function(){ 
        this.toString=function(){
            return "NONE";
        }
    }

    //只有1个实例
    this.None= this.SNone();
    this.Null = this.SNull();


    this.SFunction = function(){
        this.allEntry = new Array();//[SObject,Sobject,SFunction...] 局部变量
        this.name = "";
        this.ast = null;
        this.argument_list = [];
        this.outFunction = null;
        this.toString=function(){
            ret = "function " + this.name;
            ret += "("
            if (this.argument_list.length > 0 ){
                ret += self.argument_list[0];
                for (i in range(1, this.argument_list.length)){
                    ret += ", " + self.argument_list[i];
                }
            }
            ret += ")";
            // ret += StFunction.code(this.ast);
            return ret;
        }
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
}