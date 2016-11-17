# SPython
黄茵 傅宇豪 施鹏 华雪峰

## 概述

SPython是用JavaScript实现的一个python-like解释器，我们准备实现Python语言的基本特性。它所能解释的语言是一个Python的子集。于这个系统中，我们尽可能恢复出python的原有特性。
我们准备实现以下特性：
- 模式： 文件解释模式、交互式模式
- Python的基本数据结构，包括dict，list，tuple
- python基本运算
- 函数的定义、调用、递归
- 面向对象
- 注释
- 错误提示

## 实现流程


### BNF
我们从python2的官方文档中找到了python2的文法，我们将以该文法作为我们项目的基础。详见附录。

### Jison
这是一个类似于lex和yacc的在JavaScript下的词法分析器和语法分析器。

### 语法解析
当SPython拿到JavaScript的源码后，SPython会根据BNF来做词法分析和语法分析，并建立一棵AST(Abstract Syntax Tree)。树中的每一个叶子节点对应着一个终结符，而非叶子节点对应一个非终结符。

## 解释执行
在得到AST后，SPython将会遍历AST进行解释执行。我们准备为每种类型的节点编写相对应的解释执行的函数。在解释某一个节点时，只需要调用这个函数，它会递归处理整棵子树，获得执行结果。

