import { lex } from './lexer.js'
import { parse } from './parser.js'
let lexerCtx = {
    src: `a.b.c.d ( 2 , "xxx")
    run (2)`,
    i: 0,
    line: 1,
    tokens: [],
}

let tokens = lex(lexerCtx)
console.log("SRC: ", lexerCtx.src)
console.log("TOKENS: ", tokens)

let parserCtx = {
    tokens: tokens,
    i: 0,
}

let tree = parse (parserCtx)
// console.log("AST: ", JSON.stringify(tree, null, 2)) 
console.log( pp(tree))

function pp(ast, depth = 0) {
    let out = ""
    const prefix = '   '.repeat(depth) + '|--'
    out += prefix + ast.kind

    // iterate over the properties and add to out
    for (const [key, value] of Object.entries(ast)) {
        if (key != 'children' && key != 'kind' && key != 'i' && key != 'line') {
            out += ` | ${key}: ${value}`
        }
    }
    out += `\n`

    if (ast.children) {
        for (const child of ast.children) {
            out += pp(child, depth + 1);
        }
    }
    return out
}