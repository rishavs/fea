export class Lexer {
    constructor(src) {
        this.src = src;
        this.i = 0;
        this.line = 1;
        this.tokens = [];
    }

    match(str) {
        if (this.src.startsWith(str, this.i)) {
            let token = {kind: str, value: str, i: this.i, line: this.line}
            this.i += str.length;
            this.tokens.push(token)
            return true
        }
        return false
    }

    space() {
        let ch = this.src[this.i]
        if (ch === ' ' || ch === '\n' || ch === '\t' || ch === '\r') {
            let token = {kind: "SPACE", value: "", i: this.i, line: this.line}

            while (this.i < this.src.length) {
                ch = this.src[this.i];
                if (ch === ' ' || ch === '\t' || ch === '\r') {
                    this.i++;
                } else if (ch === '\n') {
                    this.i++;
                    this.line++;
                } else {
                    break;
                }
            }
            // tokens.push( token )
            return true
        }
        return false
    }

    comment() {
        if (this.src.startsWith('--', this.i)) {
            this.i += 2
            let foundEnd = false;
            while (this.i < this.src.length) {
                if (this.src.startsWith('--', this.i)) {
                    this.i += 2
                    foundEnd = true;
                    break;
                }
                this.i += 1
            }
            if (!foundEnd) {
                throw new Error("Unterminated comment at line " + this.line + " & pos " + this.i)
            }
            return true
        }
        return false
    }

    kwdOrName () {
        let ch = this.src[this.i];
        if (ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z') {
            let token = {
                kind: "NAME",
                value: "",
                i : this.i,
                line : this.line,
            }
            while (this.i < this.src.length) {
                ch = this.src[this.i];
                if (ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z' || ch >= '0' && ch <= '9' || ch === '_') {
                    token.value += ch;
                    this.i++;
                } else {
                    break;
                }
            }
            switch (token.value) {
            case "var" :
                token.kind = "VAR"
                break
            case "pub" :
                token.kind = "PUB"
                break
            case "true" :
                token.kind = "TRUE"
                break
            case "false" :
                token.kind = "FALSE"
                break
            }                   
            this.tokens.push(token);
            return true
        }
    }

    number() {
        let ch = this.src[this.i];
        if (ch >= '0' && ch <= '9') {
            let buffer = ch
            this.i += 1
            
            let token = {
                kind: "INT",
                value: buffer,
                i : this.i,
                line : this.line,
            }

            while (this.i < this.src.length) {
                ch = this.src[this.i]
                if (ch >= '0' && ch <= '9') {
                    buffer += ch
                    this.i += 1
                } else if (ch == '_') {
                    this.i += 1
                    
                } else if (ch == '.') {
                    if (token.kind === "FLOAT") {
                        break
                    } else {
                        token.kind = "FLOAT"
                        buffer += ch
                        this.i += 1
                    }
                } else if (ch == 'e') {
                    if (token.kind === "EXPO") {
                        break
                    } else {
                        token.kind = "EXPO"
                        buffer += ch
                        this.i += 1
                    }
                } else {
                    break
                }
            }
            this.tokens.push (token)      
            return true      
        }
        return false
    }

    string () {
        if (this.src.startsWith('"', this.i)) {
            this.i++;
            let token = {
                kind: "STRING",
                value: "",
                i : this.i,
                line : this.line,
            }
            let foundEnd = false;

            while (this.i < this.src.length) {
                let ch = this.src[this.i];
                if (ch === '"') {
                    this.i++;
                    foundEnd = true;
                    break;
                }
                token.value += ch;
                this.i++;
            }
            if (!foundEnd) {
                throw new Error("Unterminated string at line " + this.line + " & pos " + this.i)
            }
            this.tokens.push(token);
            return true
        }
        return false
    }

    run () {
        while (this.i < this.src.length) {
            switch (true) {
            case this.space()            : break
            case this.comment()          : break
            
            // Keywords & Operators
            case this.kwdOrName()               : break
            // case match("var")       : break
            // case match("pub")       : break
            
            // Idenifiers
            // case name()             : break

            // Operators
            case this.match(".")         : break
            case this.match(":")         : break
            case this.match("=")         : break

            // Literals
            case this.number()           : break
            case this.string()           : break
            case this.match("true")      : break
            case this.match("false")     : break
                    
            default                 :
                console.log("ERRORED! Tokens found so far: ", this.tokens)
                throw new Error(`Unexpected character '${this.src[this.i]}' at line ${this.line} & pos ${this.i}`) 
            }
        }
        return this.tokens
    }
}
// export const lex = (src) => {
//     let tokens = [];
//     let i = 0;
//     let line = 1;

//     const match = (kwd) => {
//         if (src.startsWith(kwd, i)) {
//             let token = {kind: kwd.toUpperCase(), value: "", i: i, line: line}
//             i += kwd.length;
//             tokens.push(token)
//             return true
//         }
//         return false
//     }

//     const space = () => {
//         let ch = src[i]
//         if (ch === ' ' || ch === '\n' || ch === '\t' || ch === '\r') {
//             let token = {kind: "SPACE", value: "", i: i, line: line}

//             while (i < src.length) {
//                 ch = src[i];
//                 if (ch === ' ' || ch === '\t' || ch === '\r') {
//                     i++;
//                 } else if (ch === '\n') {
//                     i++;
//                     line++;
//                 } else {
//                     break;
//                 }
//             }
//             // tokens.push( token )
//             return true
//         }
//         return false
//     }

//     const comment = () => {
//         if (src.startsWith('--', i)) {
//             i += 2
//             let foundEnd = false;
//             while (i < src.length) {
//                 if (src.startsWith('--', i)) {
//                     i += 2
//                     foundEnd = true;
//                     break;
//                 }
//                 i += 1
//             }
//             if (!foundEnd) {
//                 throw new Error("Unterminated comment at line " + line + " & pos " + i)
//             }
//             return true
//         }
//         return false
//     }

//     const string = () => {
//         if (src.startsWith('"', i)) {
//             i++;
//             let token = {
//                 kind: "STRING",
//                 value: "",
//                 i : i,
//                 line : line,
//             }
//             let foundEnd = false;

//             while (i < src.length) {
//                 let ch = src[i];
//                 if (ch === '"') {
//                     i++;
//                     foundEnd = true;
//                     break;
//                 }
//                 token.value += ch;
//                 i++;
//             }
//             if (!foundEnd) {
//                 throw new Error("Unterminated string at line " + line + " & pos " + i)
//             }
//             tokens.push(token);
//             return true
//         }
//         return false
//     }

//     const number = () => {
//         let ch = src[i];
//         if (ch >= '0' && ch <= '9') {
//             let buffer = ch
//             i += 1
            
//             let token = {
//                 kind: "INT",
//                 value: buffer,
//                 i : i,
//                 line : line,
//             }

//             while (i < src.length) {
//                 ch = src[i]
//                 if (ch >= '0' && ch <= '9') {
//                     buffer += ch
//                     i += 1
//                 } else if (ch == '_') {
//                     i += 1
                    
//                 } else if (ch == '.') {
//                     if (token.kind === "FLOAT") {
//                         break
//                     } else {
//                         token.kind = "FLOAT"
//                         buffer += ch
//                         i += 1
//                     }
//                 } else if (ch == 'e') {
//                     if (token.kind === "EXPO") {
//                         break
//                     } else {
//                         token.kind = "EXPO"
//                         buffer += ch
//                         i += 1
//                     }
//                 } else {
//                     break
//                 }
//             }
//             tokens.push (token)      
//             return true      
//         }
//         return false
//     }
        

//     const KwdOrName = () => {
//         let ch = src[i];
//         if (ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z') {
//             let token = {
//                 kind: "NAME",
//                 value: "",
//                 i : i,
//                 line : line,
//             }
//             while (i < src.length) {
//                 ch = src[i];
//                 if (ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z' || ch >= '0' && ch <= '9' || ch === '_') {
//                     token.value += ch;
//                     i++;
//                 } else {
//                     break;
//                 }
//             }
//             switch (token.value) {
//             case "var" :
//                 token.kind = "VAR"
//                 break
//             case "pub" :
//                 token.kind = "PUB"
//                 break
//             case "true" :
//                 token.kind = "TRUE"
//                 break
//             case "false" :
//                 token.kind = "FALSE"
//                 break
//             }                   
//             tokens.push(token);
//             return true
//         }
//     }

//     const name = () => {
//         let ch = src[i];
//         if (ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z') {
//             let token = {
//                 kind: "NAME",
//                 value: "",
//                 i : i,
//                 line : line,
//             }
//             while (i < src.length) {
//                 ch = src[i];
//                 if (ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z' || ch >= '0' && ch <= '9' || ch === '_') {
//                     token.value += ch;
//                     i++;
//                 } else {
//                     break;
//                 }
//             }
//             tokens.push(token);
//             return true
//         }
//     }

    
//     while (i < src.length) {
//         switch (true) {
//         case space()            : break
//         case comment()          : break
        
//         // Keywords & Operators
//         case KwdOrName()               : break
//         // case match("var")       : break
//         // case match("pub")       : break
        
//         // Idenifiers
//         // case name()             : break

//         // Operators
//         case match(".")         : break
//         case match(":")         : break
//         case match("=")         : break

//         // Literals
//         case number()           : break
//         case string()           : break
//         case match("true")      : break
//         case match("false")     : break
                
//         default                 :
//             console.log("ERRORED! Tokens found so far: ", tokens)
//             throw new Error(`Unexpected character '${src[i]}' at line ${line} & pos ${i}`) 
//         }
//     }
//     return tokens
// }