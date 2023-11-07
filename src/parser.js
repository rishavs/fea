import { yell } from "./utils.js"

export const id = (ctx) => {
    if (!ctx.tokens[ctx.i]) {
        return false
    }
    if (ctx.tokens[ctx.i].kind === "NAME" ) {
        let res = ctx.tokens[ctx.i]
        res.kind = `LITERAL:${res.kind}`
        ctx.i += 1
        return res
    }
    return false
}

export const literal = (ctx) => {
    if (!ctx.tokens[ctx.i]) {
        return false
    }
    if (ctx.tokens[ctx.i].kind === "INT"    || 
        ctx.tokens[ctx.i].kind === "FLOAT"  || 
        ctx.tokens[ctx.i].kind === "STRING"
    ) {
        let res = ctx.tokens[ctx.i]
        res.kind = `LITERAL:${res.kind}`
        ctx.i += 1
        return res
    }
    return false
}

export const expression = (ctx) => {
    let res = id(ctx) || literal(ctx)
    ctx.nodes.push(res)
    return res
}
export const expressionChain = (ctx) => {
    let res = literal(ctx)
    ctx.nodes.push(res)
    return res
}

export const expressionsList = (ctx) => {
    let primaryExpr = expression(ctx)
    if (!primaryExpr) {
        console.log("NO PRIMARY EXPR")
        return false
    }

    let res = [primaryExpr]
    while (true) {
        if (ctx.tokens[ctx.i] && ctx.tokens[ctx.i].kind === ",") {
            ctx.i += 1
        } else {
            break
        }

        let expr = expression(ctx)
        if (!expr) {
            yell("Expected expression at line " + ctx.tokens[ctx.i].line + " & pos " + ctx.tokens[ctx.i].i + ". Instead got " + ctx.tokens[ctx.i].kind)
        }
        res.push(expr)
    }

    return res
}

export const functionCall = (ctx) => {
    let bk = ctx.i
    let name = ctx.tokens[ctx.i].kind === "NAME"
    if (!name) {
        return false
    }
    ctx.i += 1
    
    let lparen = ctx.tokens[ctx.i].kind === "("
    if (!lparen) {
        ctx.i = bk
        return false
    }
    ctx.i += 1

    // Point of no return
    let exprList = expressionsList(ctx)
    if (!exprList) {
        yell("Expected expression list at line " + ctx.tokens[ctx.i].line + " & pos " + ctx.tokens[ctx.i].i + ". Instead got " + ctx.tokens[ctx.i].kind)
    }

    let rapren = ctx.tokens[ctx.i].kind === ")"
    if (!rapren) {
        yell("Expected ')' at line " + ctx.tokens[ctx.i].line + " & pos " + ctx.tokens[ctx.i].i + ". Instead got " + ctx.tokens[ctx.i].kind)
    }
    ctx.i += 1
    
    return {kind: "FUNC_CALL", id: name.value, i:name.i, line: name.line, providedType: "Nothing", isStatement: true, children: exprList}
}

export const statement = (ctx, parentNodeId) => {
    let res
    if (!ctx.tokens[ctx.i]) {
        return false
    }
    switch (ctx.tokens[ctx.i].kind) {
        case "NAME":
            console.log("FOUND NAME: ", ctx.tokens[ctx.i])
            res = functionCall(ctx, parentNodeId)
            if (res) { 
                console.log("FUNC CALL: ", res)
                return res
            }
        default:
            yell("Expected statement at line " + ctx.tokens[ctx.i].line + " & pos " + ctx.tokens[ctx.i].i + ". Instead got " + ctx.tokens[ctx.i].kind)
    }
    return false

}

// A block is a list of statements with their own scope
// export const scopeblock = (ctx) => {
//     let res = statement(ctx)
//     return res
// }

// A program is also a list of statements + import statements + top level declarations
export const program = (ctx) => {
    let currNodeId = 0
    ctx.nodes[currNodeId] = {kind: "PROGRAM", name: "TODO"}

    let stmtList = []
    let stmt
    while (true) {
        stmt = statement(ctx, currNodeId)
        if (!stmt) {
            break
        }

        stmtList.push(stmt)
        console.log("STMT: ", stmt)
    }
    if (stmtList.length === 0) {
        yell("No valid statement was found in the program!")}
    return {kind: "PROGRAM", name: "TODO", children: stmtList}
}

export const parse = (ctx) => {
    let res = program(ctx)
    return res
}