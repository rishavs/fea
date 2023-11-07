export const yell = (str) => {
    console.error("ERROR!", str, "\n")
    process.exit(1)
}

export function pp(ast, depth = 0) {
    let out = ""
    const prefix = '   '.repeat(depth) + '|--'
    out += prefix + ast.kind

    // iterate over the properties and add to out
    for (const [key, value] of Object.entries(ast)) {
        if (key != 'children' && key != 'kind' && key != 'i' && key != 'line') {
            out += ` | ${key}: ${value}`
        }
    }
    out += `\n`

    if (ast.children) {
        for (const child of ast.children) {
            out += pp(child, depth + 1);
        }
    }
    return out
}