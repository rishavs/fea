import { Lexer } from "./lexer.js";
import { Parser } from "./parser.js";

let src = `var xyz_123 = "hello world"
myInt = 10
myFloat : Float = 1.23_4
MyObj.Myprop.myExpo = 4.56e78
`
let src2 = `myObj.myprop.myExpo = 4.56e78`

const lexer = new Lexer(src2);
const tokens = lexer.run();
console.log(tokens);

const p = new Parser(tokens);
const identifier = () => p.seq(
    [
        p.is("NAME"),
        p.oneOrMany(
            p.seq([
                p.is("."), p.is("NAME")
            ])
        )
    ], (res) => {
        let merged = {
            kind: "IDENTIFIER",
            value: ""
        }
        // the min of all i will be merged.i
        // the min of all lines will be merged.line
        merged.i = 0
        merged.line = 0
        for (let item of res.parsed) {
            merged.value += item.value
            if (merged.i == 0) {
                merged.i = item.i
            } else if (item.i < merged.i) {
                merged.i = item.i
            }
            if (merged.line == 0) {
                merged.line = item.line
            } else if (item.line < merged.line) {
                merged.line = item.line
            }
        }

        return {
            ok: true,
            parsed: [merged]
        }
        
    },
    (res, ast) => {
        let parentId = ast.length - 1
        let node = {
            name: res.parsed[0].kind,
            value: res.parsed[0].value,
            depth: ast[parentId].depth + 1,
            parent: parentId,

        }
        return node
    }
)

let variable = () => p.seq([
    p.opt(p.is("PUB")), 
    p.is("VAR")
])

let grammar = identifier()
let result = grammar()
console.log(result)
console.log("AST :", p.ast)
