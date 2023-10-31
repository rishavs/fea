export class Parser {
    
    constructor(tokens) {
        this.tokens = tokens
        this.i = 0
    }

    // the only parser
    is(tokenName) {
        return () => {
            if (this.i >= this.tokens.length) {
                return {ok: false}
            }
            if (this.tokens[this.i].kind === tokenName) {
                let res = this.tokens[this.i]
                res.ok = true
                res.consumed = true
                this.i += 1
                return res
            }
            return {ok: false}
        }
    }

    // Combinators
    seq(...parsers) {
        return () => {
            let backup = this.i
            let res = {ok: true, children: []}

            for (let parser of parsers) {
                let pout = parser()
                if (pout.ok) {
                    res.children.push(pout)
                } else {
                    this.i = backup
                    return {ok: false}
                }
            }
            return res
        }
    }
    
    either(...parsers) {
        return () => {
            let backup = this.i
            let res = {ok: false}

            for (let parser of parsers) {
                let pout = parser()
                if (pout.ok) {
                    return pout
                }
            }
            this.i = backup
            return {ok: false}            
        }
    }

    opt(parser) {
        return () => {
            let pout = parser()
            if (pout.ok) {
                return pout
            } 
            return {ok: true}
        }
    }

    zeroOrMany(parser) {
        return () => {
            let res = {ok: true, children: []}
            let atLeastOne = false

            while (true) {
                let pout = parser()
                if (pout.ok) {
                    res.children.push(pout)
                    atLeastOne = true
                } else {
                    break
                }
            }
            if (atLeastOne) {
                return res
            }
            return {ok: true}
        }
    }

    oneOrMany(parser) {
        return () => {
            let backup = this.i
            let res = {ok: false}

            while (true) {
                let pout = parser()
                if (pout.ok) {
                    if (!res.children) {
                        res.children = []
                    }
                    res.children.push(pout)
                    res.ok = true
                } else {
                    this.i = backup
                    break
                }
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
