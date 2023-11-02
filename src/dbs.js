
export let BuiltinSymbols = {
    "Core.exit": {
        kind: "FUNC_CALL",
        context: "Universal",
        typeSig: "( Int | Nothing ) -> Nothing",
        name: "Core.exit",
        ret: "Nothing"
    },
    "Core.show": {
        kind: "FUNC_CALL",
        typeSig: "( String | Nothing ) -> Nothing",
        context: "Universal",
        name: "Core.show",
        ret: "Nothing"
    },

}

export let CustomSymbols = {

}


export let BuiltinTypes = {
    Anything    : "Anything",
    Nothing     : "Nothing",
    Something   : "Something",
    Int         : "Int",
    Float       : "Float",
    String      : "String",
}

export let CustomTypes = {

}