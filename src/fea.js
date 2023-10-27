import { Lexer } from "./lexer.js";
import { Parser } from "./parser.js";

// TODO - fix the bug with 1.a as float
// let src = `1.a.b.c.d.e`
let src = `Core.exec ( a.c.x , 2, "yes")`

const lexer = new Lexer(src);
const tokens = lexer.run();
console.log(tokens);

const p = new Parser(tokens);

// Program = Statements
// Statements = oneOrMany(Statement)
// Statement = ExpressionStatement
// ExpressionStatement = FunctionCall
// FunctionCall = Identifier, "(", Expression, zeroOrMany(,, Expression), ")"
// Expression = Identifier | Literal
// Literal = Number | String

// prob is that we are running out of i. someone is not handling the false case properly. not resetting?

let literal = () => p.either([
    p.is("INT"),
    p.is("FLOAT"),
    p.is("EXPO"),
    p.is("STRING")
])

let identifier = () => p.seq(
    [
        p.is("NAME"),
        p.zeroOrMany(
            p.seq([
                p.is("."), p.is("NAME")
            ])
        )
    ], 
    // (res) => {
    //     let merged = {
    //         kind: "IDENTIFIER",
    //         value: ""
    //     }
    //     // the min of all i will be merged.i
    //     // the min of all lines will be merged.line
    //     merged.i = 0
    //     merged.line = 0
    //     for (let item of res.parsed) {
    //         merged.value += item.value
    //         if (merged.i == 0) {
    //             merged.i = item.i
    //         } else if (item.i < merged.i) {
    //             merged.i = item.i
    //         }
    //         if (merged.line == 0) {
    //             merged.line = item.line
    //         } else if (item.line < merged.line) {
    //             merged.line = item.line
    //         }
    //     }

    //     return {
    //         ok: true,
    //         parsed: [merged]
    //     }
        
    // }
)

let expression = () => p.either([
    literal(),
    identifier()
])

let expressionsList = () => p.seq([
    expression(),
    p.zeroOrMany(
        p.seq([
            p.is(","),
            expression()
        ])
    )
])

let functionCall = () => p.seq([
    identifier(),
    p.is("("),
    expressionsList(),
    p.is(")")
])

let expressionStatement = () => p.either([
    functionCall()
])

let statement = () => p.either([
    expressionStatement()
])

let statements = () => p.oneOrMany(statement())

let program = () => statements()


// let ast =  [ { name: 'ROOT', depth: 0, children: [] } ]
let result = program()
console.log(result)
console.log("AST :", p.ast)



let variable = () => p.seq([
    p.opt(p.is("PUB")), 
    p.is("VAR")
])
