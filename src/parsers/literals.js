class LiteralNode {
    constructor(kind, value, parent) {
        this.kind = kind
        this.value = value
        this.parent = parent
    }

    evaluate() {
        return this.value
    }
}