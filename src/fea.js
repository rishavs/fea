import { lex } from './lexer.js'
import { parse } from './parser.js'
import { syntaxChecker } from './syntaxChecker.js'
import { pp } from './utils.js'

let lexerCtx = {
    src: `x .y12.s__ab  
    .t  ( 2
        )`,
    i: 0,
    line: 1,
    tokens: [],
}

let tokens = lex(lexerCtx)
console.log("SRC: ", lexerCtx.src)
console.log("TOKENS: ", tokens)

// let checkedOutput = syntaxChecker(tokens)
// console.log("CHECKED OP: ", checkedOutput)

let parserCtx = {
    tokens: tokens,
    i: 0,
    currNodeId: 0,
    nodes: [],
    ast: [],
}

let tree = parse (parserCtx)
console.log("AST: ", JSON.stringify(tree, null, 2)) 
// console.log( pp(tree))

console.log("Parse Stack: ", parserCtx.nodes)

