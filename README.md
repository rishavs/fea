# Fëa

> A tiny and elegant functional language 

## About

The Fea compiler is written in Nim

Inspired by F#, attolang and Keli language.

## Principles (in order of priority)
1. Dev Exp is most important
2. Batteries included
3. Instant compilation
4. Readability
5. C like performance

# Rough



Quick thoughts

- literate. Everything is a comment. 
  Except the bits which are in the markdown code tags 
  
 - each file is a package. see ES6 imports/exports for how modules should behave 

- extremely small. all syntax "should fit on a postcard"

- compiles to c99. 80% of the performance of C with only 20% of the headache

- Static Typing with type inference

- Impure functional

- only one way to do anything

- filenames as modules and namespaces. start at main.fea always

- fully async, concurrent and parallel by default

- no globals. everything is local scoped

- no vars?

- utf8 strings

- FRP?

- memory. ARC vs Immix?

- has algebraic types and maybes

- how to error? railroad?

- hot reloading? with a aot release version for speedup?
- All keywords can be fully internationalized

- build types [dev(fastest compilation), debug, release(fastest execution and low overhead)]

- opinionated formatter in compiler itself with opt-out

- Test block part of function definition?

- Only way for a statement to access a var in the immediate parent scope is to use the parent.x or parentid.x

- Declarations and control flow constructs are expressions too. “everything is an expression” . To do that, for each “statement-like” construct in the language, you need to decide what value it evaluates to. eg

  - A variable declaration evaluates to the value of the variable.
  - A block evaluates to the result of the last expression in the sequence.
  - An `if` expression evaluates to the result of whichever branch is chosen. Likewise, a `switch` or other multi-way branch evaluates to whichever case is picked

- Everything is either code or data.

  all data is a key value object. every data object must be of a basic type or a composed type.

  all code is either expression or function.

```
int a is 2

define Circle as {
    radius: Int,
    circumference:Int
    }
end

Circle new_circle is {
    radius is 10,
    circumference is 20
    }

define LotsaCircles as
    List of Circle
end

define Answer as
    | Yes
    | No
end


// retruns/retrun/returning are all same//

do substract int a, int b return int as
    if a < b and a > 0 and b > 0
        say "Can't do. 0 is my best offer!"
        0
    else 
        a - b
    end
end



do additionof a, b as a + b end

int a is additionof 2, 3

do add_then_square_and_check_even 
    int a, int b 
    return 
        fact, string 
    as
        x   is checkifeven square add a,b
        x   is flow add a,b then square then checkifeven end

end

do ifelseflow fact isTrue return 
    say "Is True"

// builtin?
define case as {
    path1: do,
    path2:  block
    }
end

Case caseflow is {
    4 : fncall1,
    5 : fncall2,
    _ : fncall3  
}

map caseflow int k, block v 

eval ( int x) return int as
    y is 
    if x < 5 then 
        something
    elseif x >10 then something
    else something
    end

```

# Rough

Compiler Starts

- read program file 
- Extract code part
- Stitch code blocks in a file
- stitch code blocks from other files into a single string
- Tokenize and parse grammar into ordered array of tokens
- raise syntax and parsing errors
- detail error and hint by analyzing characters
- identify identifier scoping
- Compile time evaluation/constant folding??
- unfold blocks like loops, functions etc into nodes
- raise recursion errors
- Stitch modules and calls
- raise semantic errors like missing branches in conditionals

AST Generated

- check types
- infer types for missing ones
- raise type errors, if conflict
- Basic tree shaking/folding??

Clean AST Generated

Transform To X AST/IR/Codegen

#### Error

Line number, char number of token

type

message

Hint

#### Flow



Search for ```

​	If any instance of ``` is not appended by BOL + optional whitespace raise error

​	if ``` doesnt have a closing counterpart, raise error

​	else extract all text between 2 consecutive ``` and save somewhere

stitch all extracted text

start parsing









Parts of the lang:

* MDText
  * CodeText
    * Code
      * Expression
        * Operators (infix?)
      * Statement
      * id 
      * typeassign
      * type
        - BasicType
        - ComplexType
          - SumType
          - ObjectType
      * valueassign
      * codeblockassign
      * Symbols
        * BOF
        * EOF
        * Whitespace
        * EOL
        * BOL
      * Comment
  * LitText
* 

Memory only stack based? using linked lists internally?

everything is an assignment and a function

a:int -> 10

is same as a

a:int (_:null) -> 10 end

If is itself a function taking arguments (expression, truthi returnable, falsey returnable)?

if add(6,4) == 10:

​	then print "10 is the truth"

​	else print "10 is not the truth"



x:truth -> equals (add(6,4), 10)





add:task (x:int, y:int):int ->
    x + y
end

n:int is add x, y

do add(y:int):int ->
    x + y
end

d:list:int -> [2,3]
e:obj:{str => str} -> {"key" => "value"}

x:int -> 2

do add (y:int):int ->
    x + y
end

start ():int ->
    _ -> show add (1)
    0
end

any var, const, module object that needs to be shared should have $ suffix
local scope will always take precedence. if a var form another scope is to be used, use the full path module.var eg main.x in the add func.
No modules. the file name is the module namespace. if namespace needs to be changed, change file
show is a builtin func which pretty prints to console

? checks if a val exists

std:book    -> read stdlib // no need to use brackets if only 1 argument
BO::book    -> read BasicOprerations from ('../path')

@Const
#addresses
$shared

a:int -> 10
start (a:int):int

```
flow with a
    |> BO.substract #, 5    >> BO.multiply #, 10        >> val is #     >> say #
    |> amplify #, 2         >> val is #                 >> say #
    |> say #                >> std.formatter.pretty #
end

return 0

catching error 
    if typeof(error) == # // pattern matching
        # == WrongType ->
            say("The error type is {{#}}")
        # == else ->
            say ("Some unhandled error was found")
    end
end
```

end

start

take a
|> fna >> fnb
|> fnc >> fnd

typedef = recipe?

------

a:int -> 20

share amplify (x:int, y:int):int ->
    x^y
end

a:int -> 30

do $substract (x:int, y:int):int -> // $ makes a func public
    x - y
end

do $add (x:int, y:int):int ->
    let z = x + y
    return z
end

multiply (x:int, y:int):int -> x * y

expose(add, substract, multiply)



```nim
Coder:define =>
  	| Person:{    	
  		name:string,
    	age:int
    }
  	| Employee:Person
  	| "whelp":str
end

peep:Coder => {name = "Rick", age = 35}
```



## License

Copyright (c) 2018

Licensed under the [MIT license](LICENSE).
