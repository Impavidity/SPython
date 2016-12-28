/*
Written by Peng:
    Test the Res Module
*/

var ResClass = require("./Res");
var ObjectBase = require("./Object");
or1 = new ObjectBase.SObject();
or1.type = "Boolean";
or1.value = false;
or2 = new ObjectBase.SObject();
or2.type = "Boolean";
or2.value = false;
or3 = new ObjectBase.SObject();
or3.type = "String"
or3.value = "Hello"
args = new Array();
args.push(or1);
args.push(or2);
args.push(or3);
var result = ResClass.RES_or_test(args);
console.log(result.value);

