import { Lexer } from "./lexer.js";
import { Parser } from "./parser.js";

// TODO - fix the bug with 1.a as float
// let src = `1.a.b.c.d.e`
let src = `var x = 1.2e3`

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

let literal = () => p.hammer(p.either([
    p.is("INT"),
    p.is("FLOAT"),
    p.is("EXPO"),
    p.is("STRING")
]), (res) => {
    console.log("literal", res)
    // if (res.ok) {
    //     res.node = {
    //         name: `LITERAL:${res.parsed[0].kind}`,
    //         value: res.parsed[0].value,
    //         i: res.parsed[0].i,
    //         line: res.parsed[0].line,
    //     }
    // }
    return res  
})

// let literal = () => p.either([
//     p.is("INT"),
//     p.is("FLOAT"),
//     p.is("EXPO"),
//     p.is("STRING")
// ])

let identifier = () => p.hammer(p.seq(
        p.is("NAME"),
        p.zeroOrMany(
            p.seq(
                p.is("."), p.is("NAME")
            )
        )
    ), (res) => {
        // console.log("identifier", res)
        if (res.ok) {
            let out = {
                kind: `IDENTIFIER`,
                value: res.children[0].value,
                i: res.children[0].i,
                line: res.children[0].line,
            }
            
            if (res.children[1].ok && res.children[1].children ) {
                for (let item of res.children[1].children) {
                    out.value += item.children[0].value + item.children[1].value

                    out.i = item.children[1].i
                    out.line = item.children[1].line
                }
            }   
            return out
        }
        return res
    }) 


let expression = () => p.hammer(p.either(
    literal(),
    identifier()
), (res) => {
    console.log("expression", res)
    return res
})

let expressionsList = () => p.seq(
    expression(),
    p.zeroOrMany(
        p.seq(
            p.is(","),
            expression()
        )
    )
)

let functionCall = () => p.seq(
    identifier(),
    p.is("("),
    expressionsList(),
    p.is(")")
)

let expressionStatement = () => p.either(
    functionCall()
)

let statement = () => p.either(
    expressionStatement()
)
let statements = () => p.oneOrMany(statement())
let program = () => statements()

let parse = program()

let result =  parse()
console.log("AST: ", JSON.stringify(result, null, 2))