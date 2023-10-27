export class Parser {
    
    constructor(tokens) {
        this.tokens = tokens
        this.i = 0
        this.ast = [{name: "ROOT", depth: 0, children: []}]
    }

    // the only parser
    is(tokenName) {
        return () => {
            let res = {ok: false, parsed: [], node: {}}
            if (this.i >= this.tokens.length) {
                return res
            }
            if (this.tokens[this.i].kind === tokenName) {
                res.ok = true
                res.parsed.push(this.tokens[this.i])
                res.node.value = this.tokens[this.i].value
                this.i += 1
                return res
            }
            return res
        }
    }

    // Combinators
    seq(parsers) {
        return () => {
            let backup = this.i
            let res = {ok: false, parsed: [], node: {children: []}}

            for (let parser of parsers) {
                let pout = parser()
                if (pout.ok) {
                    res.parsed.push(...pout.parsed)
                    if (pout.node) {
                        res.node.children.push(pout.node)
                    }
                    // console.log(res)
                } else {
                    this.i = backup
                    res.ok = false
                    res.parsed = []
                    res.node = {}
                    return res
                }
            }
            res.ok = true

            return res
        }
    }
    
    either(parsers) {
        return () => {
            let backup = this.i
            let res = {ok: false,parsed: [], node: {}}

            for (let parser of parsers) {
                let pout = parser()
                if (pout.ok) {
                    res.ok = true
                    res.parsed.push(...pout.parsed)
                    res.node = pout.node
                    return res
                }
            }
            this.i = backup
            res.ok = false
            
            return res
        }
    }

    opt(parser) {
        return () => {
            let pout = parser()
            if (pout.ok) {
                return pout
            } 
            return {ok: true, parsed: pout.parsed, node: {}}
        }
    }

    zeroOrMany(parser) {
        return () => {
            let res = {ok: true, parsed: [], node: {children:[]}}

            while (true) {
                let pout = parser()
                if (pout.ok) {
                    res.parsed.push(...pout.parsed)
                    if (pout.node) {
                        res.node.children.push(pout.node)
                    }
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
            let res = {ok: false,parsed: [], node: {children: []}}
            let atLeastOne = false
            let tempChildren = []

            while (true) {
                let pout = parser()
                if (pout.ok) {
                    atLeastOne = true
                    res.parsed.push(...pout.parsed)
                    if (pout.node) {
                        tempChildren.push(pout.node)
                    }
                } else {
                    this.i = backup
                    break
                }
            }
            if (atLeastOne) {
                res.ok = true
                res.node.children = tempChildren
            }
            return res
        }
    }

    hammer(parser, mutater) {
        return () => {
            let res = parser()
            if (mutater) {
                res = mutater(res)
            }
            
            return res
        }
    }


}
