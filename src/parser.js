import { yell } from "./utils.js"

export const qualifiedName = (ctx) => {
    if (ctx.tokens[ctx.i].kind === "NAME") {
        let qName = ctx.tokens[ctx.i]
        ctx.i += 1
        while (true) {
            if (ctx.tokens[ctx.i] && ctx.tokens[ctx.i].kind === "." 
                && ctx.tokens[ctx.i + 1] && ctx.tokens[ctx.i + 1].kind === "NAME"
            ) { 
                qName.value += "." + ctx.tokens[ctx.i + 1].value
                ctx.i += 2
            } else { 
                break 
            }
        }
        return qName
    }
    return false
}

export const literal = (ctx) => {
    if (!ctx.tokens[ctx.i]) {
        return false
    }
    let res
    switch (ctx.tokens[ctx.i].kind) {
        case "INT": case "FLOAT": case "STRING":
            res = ctx.tokens[ctx.i]
            res.kind = `LITERAL:${res.kind}`
            ctx.i += 1
            return res
        case "NAME":
            res = qualifiedName(ctx)
            return res
        default:
            return false
    }
}

export const expression = (ctx) => {
    let res = literal(ctx)
    return res
}

export const expressionsList = (ctx) => {
    let primaryExpr = expression(ctx)
    if (!primaryExpr) {
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
    let qname = qualifiedName(ctx)
    if (!qname) {
        return false
    }
    
    let lparen = ctx.tokens[ctx.i].kind === "("
    if (!lparen) {
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

    return {kind: "FUNC_CALL", id: qname.value, i:qname.i, line: qname.line, providedType: "Nothing", isStatement: true, children: exprList}
}

export const statement = (ctx) => {
    let res
    if (!ctx.tokens[ctx.i]) {
        return false
    }
    switch (ctx.tokens[ctx.i].kind) {
        case "NAME":
            res = functionCall(ctx)
            if (res) { return res } else { break }
        default:
            yell("Expected statement at line " + ctx.tokens[ctx.i].line + " & pos " + ctx.tokens[ctx.i].i + ". Instead got " + ctx.tokens[ctx.i].kind)
    }

}

// A block is a list of statements
export const scopeblock = (ctx) => {
    let res = statement(ctx)
    return res
}

// A program is also a list of statements + import statements + top level declarations
export const program = (ctx) => {
    let stmtList = []
    let stmt
    while (true) {
        stmt = statement(ctx)
        if (!stmt) {
            break
        }
        stmtList.push(stmt)
    }
    return {kind: "PROGRAM", name: "TODO", children: stmtList}
}

export const parse = (ctx) => {
    let res = program(ctx)
    return res
}