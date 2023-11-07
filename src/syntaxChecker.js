export const syntaxChecker = (tokens) => {
    let i = 0

    const is = (tokenName) => {
        return () => {
            if (tokens[i] && tokens[i].kind === tokenName) {
                i += 1
                return true
            }
            return false
        }
    }
    
    const seq = ( ...parsers) => {
        return () => {
            let bk = i
            for (let parser of parsers) {
                if (!parser()) {
                    i = bk
                    return false
                }
            }
            return true
        }
    }
    
    const either = ( ...parsers) => {
        return () => {
            let bk = i
            for (let parser of parsers) {
                if (parser()) {
                    return true
                }
            }
            i = bk
            return false
        }
        }
    
    const opt = ( parser) => {
        return () => {
            parser()
            return true
        }
    }
    
    const anyNumOf = ( parser) => {
        return () => {
            while (true) {
                if (!parser()) {
                    break
                }
            }
            return true
        }
    }
    
    const atLeastOne = ( parser) => {
        return () => {
            let bk = i
            let atLeastOne = false
            while (true) {
                if (parser()) {
                    atLeastOne = true
                } else {
                    break
                }
            }
            if (!atLeastOne) {
                i = bk
            }
            return atLeastOne
        }
    }
    
    const chop = ( parser, mutater) => {
        return () => {
            let start = i
            let res = parser()
            let end = i
            let chopped = tokens.slice(start, end)
            
            if (mutater) {
                mutater(res, chopped)
            }
            return res
        }
    }
    
    // --------------------------------------
    // Syntax Rules
    // --------------------------------------

    const literal = () => chop( either( 
        is( "INT"), is( "FLOAT"), is( "STRING")
        ),
        (res, chopped) => {
            console.log( res, chopped)
        }
    )

    const expression = () => chop(
        either( is("NAME"), literal()),
        (res, chopped) => {
            console.log("EXPR: ", res, chopped)
        }
    )
    
    const varStmt = () => seq( 
        opt(is( "var")), is( "NAME"), is( "="), expression()
    )
    
    const statement = () => chop( 
        either( varStmt()),
        (res, chopped) => {
            console.log("STMT: ", res, chopped)
        }
    )
    
    const statementsList = () => seq( 
        statement(), anyNumOf(statement())
    )
    const program = () => statementsList()
    
    let res = program()
    return res()
}
