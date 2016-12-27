file_input: (stmt)*
funcdef: 'def' NAME parameters ':' suite
suite: simple_stmt | NEWLINE INDENT stmt+ DEDENT
parameters: '(' [varargslist] ')'
'''
varargslist: ((fpdef ['=' test] ',')* ('*' NAME [',' '**' NAME] | '**' NAME) | fpdef ['=' test] (',' fpdef ['=' test])* [','])
fpdef: NAME | '(' fplist ')'
fplist: fpdef (',' fpdef)* [',']
'''
stmt: simple_stmt | compound_stmt
simple_stmt: (expr_stmt | print_stmt  | del_stmt | pass_stmt | flow_stmt | import_stmt | global_stmt | exec_stmt | assert_stmt)
compound_stmt: if_stmt | while_stmt | for_stmt | funcdef | classdef 
expr_stmt: testlist augassign testlist | testlist '=' testlist
augassign: ('+=' | '-=' | '*=' | '/=' | '%=' | '&=' | '|=' | '^=' | '<<=' | '>>=' | '**=' | '//=')
print_stmt: 'print' testlist
del_stmt: 'del' exprlist
pass_stmt: 'pass'
flow_stmt: break_stmt | continue_stmt | return_stmt  
break_stmt: 'break'
continue_stmt: 'continue'
return_stmt: 'return' [testlist]
global_stmt: 'global' NAME (',' NAME)*
exec_stmt: 'exec' expr ['in' test [',' test]]
assert_stmt: 'assert' test [',' test]

if_stmt: 'if' test ':' suite ('elif' test ':' suite)* ['else' ':' suite]
while_stmt: 'while' test ':' suite 
for_stmt: 'for' exprlist 'in' testlist ':' suite

test: or_test
or_test: and_test ('or' and_test)*
and_test: not_test ('and' not_test)*
not_test: 'not' not_test | comparison
comparison: expr (comp_op expr)*
comp_op: '<'|'>'|'=='|'>='|'<='|'<>'|'!='|'in'|'not' 'in'|'is'|'is' 'not'
expr: xor_expr ('|' xor_expr)*
xor_expr: and_expr ('^' and_expr)*
and_expr: shift_expr ('&' shift_expr)*
shift_expr: arith_expr (('<<'|'>>') arith_expr)*
arith_expr: term (('+'|'-') term)*
term: factor (('*'|'/'|'%'|'//') factor)*
factor: ('+'|'-'|'~') factor | power
power: atom trailer* ['**' factor] # Not finished
atom: ('(' [testlist_comp] ')' | # not finished
       '[' [listmaker] ']' | #not finished
       '{' [dictorsetmaker] '}' | # not finished
       NAME | NUMBER | STRING+)  
trailer: '(' [arglist] ')' | '[' subscriptlist ']' | '.' NAME # not finished
listmaker: test ( list_for | (',' test)* [','] )
dictorsetmaker: ( (test ':' test (comp_for | (',' test ':' test)* [','])) |
                  (test (comp_for | (',' test)* [','])) ) #not finished
testlist_comp: test ( comp_for | (',' test)* [','] ) 
classdef: 'class' NAME ['(' [testlist] ')'] ':' suite
exprlist: expr (',' expr)* [',']
testlist: test (',' test)* [',']

list_iter: list_for | list_if
list_for: 'for' exprlist 'in' testlist_safe [list_iter]
list_if: 'if' old_test [list_iter]

# The following should be finished but I do not finish them currently
subscriptlist: subscript (',' subscript)* [',']
subscript: '.' '.' '.' | test | [test] ':' [test] [sliceop]
sliceop: ':' [test]





arglist: (argument ',')* (argument [','] |'*' test (',' argument)* [',' '**' test] |'**' test)
# The reason that keywords are test nodes instead of NAME is that using NAME
# results in an ambiguity. ast.c makes sure it's a NAME.
argument: test [comp_for] | test '=' test



testlist_safe: old_test [(',' old_test)+ [',']]
old_test: or_test | old_lambdef
old_lambdef: 'lambda' [varargslist] ':' old_test



comp_iter: comp_for | comp_if
comp_for: 'for' exprlist 'in' or_test [comp_iter]
comp_if: 'if' old_test [comp_iter]

testlist1: test (',' test)*
