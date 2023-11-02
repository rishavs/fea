import { yell } from "./utils.js"

const match = (ctx, str) => {
    if (ctx.src.startsWith(str, ctx.i)) {
        let token = {kind: str, value: str, i: ctx.i, line: ctx.line}
        ctx.i += str.length;
        ctx.tokens.push(token)
        return true
    }
    return false
}

const comment = (ctx) => {
    if (ctx.src.startsWith('--', ctx.i)) {
        ctx.i += 2
        let foundEnd = false;
        while (ctx.i < ctx.src.length) {
            if (ctx.src.startsWith('--', ctx.i)) {
                ctx.i += 2
                foundEnd = true;
                break;
            }
            ctx.i += 1
        }
        if (!foundEnd) {
            yell("Unterminated comment at line " + ctx.line + " & pos " + ctx.i)
        }
        return true
    }
    return false
}

const space = (ctx) => {
    let ch = ctx.src[ctx.i]
    if (ch === ' ' || ch === '\n' || ch === '\t' || ch === '\r') {
        let token = {kind: "SPACE", value: "", i: ctx.i, line: ctx.line}

        while (ctx.i < ctx.src.length) {
            ch = ctx.src[ctx.i];
            if (ch === ' ' || ch === '\t' || ch === '\r') {
                ctx.i++;
            } else if (ch === '\n') {
                ctx.i++;
                ctx.line++;
            } else {
                break;
            }
        }
        // ctx.tokens.push( token )
        return true
    }
    return false
}

const string = (ctx) => {
    if (ctx.src.startsWith('"', ctx.i)) {
        ctx.i++;
        let token = {
            kind: "STRING",
            value: "",
            i : ctx.i,
            line : ctx.line,
        }
        let foundEnd = false;

        while (ctx.i < ctx.src.length) {
            let ch = ctx.src[ctx.i];
            if (ch === '"') {
                ctx.i++;
                foundEnd = true;
                break;
            }
            token.value += ch;
            ctx.i++;
        }
        if (!foundEnd) {
            yell("Unterminated string at line " + ctx.line + " & pos " + ctx.i)
        }
        ctx.tokens.push(token);
        return true
    }
    return false
} 

const number = (ctx) => {
    let ch = ctx.src[ctx.i];
    if (ch >= '0' && ch <= '9') {
        let buffer = ch
        ctx.i += 1
        
        let token = {}
        token.kind = "INT"
        token.value = buffer

        while (ctx.i < ctx.src.length) {
            ch = ctx.src[ctx.i]
            if (ch >= '0' && ch <= '9') {
                buffer += ch
                ctx.i += 1
            } else if (ch == '_') {
                ctx.i += 1
                
            } else if (ch == '.') {
                if (token.kind === "FLOAT") {
                    break
                } else {
                    token.kind = "FLOAT"
                    buffer += ch
                    ctx.i += 1
                }
            } else {
                break
            }
        }
        
        token.value = buffer
        token.i = ctx.i
        token.line = ctx.line

        // Some error checks
        if (token.kind === "FLOAT") {
            if (token.value.endsWith(".")) {
                yell("Invalid float literal at line " + ctx.line + " & pos " + ctx.i)
            }
        } else {
            // INT
        }

        ctx.tokens.push (token)      
        return true      
    }
    return false
}

const name = (ctx) => {
    let ch = ctx.src[ctx.i]
    if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
        let token = {kind: "NAME", value: "", i: ctx.i, line: ctx.line}
        while (ctx.i < ctx.src.length) {
            ch = ctx.src[ctx.i];
            if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
                token.value += ch;
                ctx.i++;
            } else {
                break;
            }
        }
        ctx.tokens.push(token);
        return true
    }
    return false
}



export const lex = (ctx) => {
    
    while (ctx.i < ctx.src.length) {
        switch (true) {
        case space(ctx)             : break
        case comment(ctx)           : break
        
        // Keywords & Operators
        // case kwdOrName()        : break
        case match(ctx, "var")      : break
        case match(ctx, "pub")      : break
        
        // Idenifiers
        // case name()             : break

        // Operators
        case match(ctx, ".")        : break
        case match(ctx, ":")        : break
        case match(ctx, ",")        : break
        case match(ctx, "=")        : break
        case match(ctx, "(")        : break
        case match(ctx, ")")        : break

        // Literals
        case name(ctx)              : break
        case number(ctx)            : break
        case string(ctx)            : break

                
        default                     :
            console.log("ERRORED! Tokens found so far: ", ctx.tokens)
            yell(`Unexpected character '${ctx.src[ctx.i]}' at line ${ctx.line} & pos ${ctx.i}`) 
        }
    }
    return ctx.tokens
}
