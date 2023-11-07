class ASTNode {
    constructor(kind, value) {
      this.kind = kind;
      this.value = value;
      this.children = [];
      this.props = {}; // ad hoc node specific properties
      this.parent = null; // Reference to the parent node
    }
  
    // Add a child node and set its parent
    addChild(child) {
      child.parent = this;
      this.children.push(child);
    }
  }