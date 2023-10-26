export class Parser {
    
    constructor(tokens) {
        this.tokens = tokens
        this.i = 0
        this.ast = [{name: "ROOT", depth: 0, children: []}]
    }

    // the only parser
    is(tokenName) {
        return () => {
            let res = {ok: false, parsed: [this.tokens[this.i]], node: []}
            if (this.tokens[this.i].kind === tokenName) {
                this.i += 1
                res.ok = true
                return res
            }
            return res
        }
    }

    // Combinators
    seq(parsers, mutater, nodify) {
        return () => {
            let backup = this.i
            let res = {ok: false, parsed: [], node: []}

            for (let parser of parsers) {
                let pout = parser()
                if (pout.ok) {
                    res.parsed.push(...pout.parsed)
                    // console.log(res)
                } else {
                    this.i = backup
                    res.ok = false
                    return res
                }
            }
            res.ok = true
            if (mutater) {
                res = mutater(res)
            }
            if (nodify) {
                // create child node
                let node = nodify(res, this.ast)

                // add node to ast
                this.ast.push(node)

                // add node to parent's children
                this.ast[node.parent].children.push(this.ast.length - 1)
            }
            
            return res
        }
    }
    
    either(parsers, raise) {
        return () => {
            let backup = this.i
            let res = {ok: false, parsed: []}

            for (let parser of parsers) {
                let pout = parser()
                if (pout.ok) {
                    res.ok = true
                    res.parsed.push(...pout.parsed)
                    return res
                }
            }
            this.i = backup
            res.ok = false
            if (raise) {
                raise(res)
            }
            return res
        }
    }

    opt(parser) {
        return () => {
            let pout = parser()
            if (pout.ok) {
                return pout
            } 
            return {ok: true, parsed: []}
        }
    }

    zeroOrMany(parser) {
        return () => {
            let backup = this.i
            let res = {ok: true, parsed: []}

            while (true) {
                let pout = parser()
                if (pout.ok) {
                    res.parsed.push(...pout.parsed)
                } else {
                    break
                }
            }
            return res
        }
    }

    oneOrMany(parser) {
        return () => {
            let backup = this.i
            let res = {ok: false, parsed: []}
            let atLeastOne = false

            while (true) {
                let pout = parser()
                if (pout.ok) {
                    atLeastOne = true
                    res.parsed.push(...pout.parsed)
                } else {
                    this.i = backup
                    break
                }
            }
            if (atLeastOne) {
                res.ok = true
            }
            return res
        }
    }

}
