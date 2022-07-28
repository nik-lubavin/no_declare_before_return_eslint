class Logger {
  static enable = false;

  static init(options) {
    if (options.enable) {
      this.enable = options.enable;
    }
  }

  static logParsingNode(node, extra = '') {
    if (!this.enable) return;

    const startLine = node.loc?.start?.line || 0;
    const endLine = node.loc?.end?.line || 0;
    console.log('parsing:', extra, {
      type: node.type,
      startLine,
      endLine,
    });
  }

  static logParsingBlock(node) {
    if (!this.enable) return;

    const startLine = node.loc?.start?.line || 0;
    const endLine = node.loc?.end?.line || 0;
    console.log('parsing block:', {
      type: node.type,
      startLine,
      endLine,
      blockBody: node.body,
    });
  }

  static logString(str) {
    if (!this.enable) return;

    console.log(str);
  }

  static addedVariable(node, name) {
    if (!this.enable) return;

    console.log(console.log(`Added variable ${name} (${node.loc?.start?.line} - ${node.loc?.end?.line})`));
  }

  static removedVariable(node, name, declaredVariables) {
    if (!this.enable) return;

    console.log(console.log(`Removed variable ${name} (${node.loc?.start?.line} - ${node.loc?.end?.line})`,
      { declaredVariables }));
  }

  static error(msg) {
    if (!this.enable) return;

    console.error(msg);
  }

  static lintReport(node, error, declaredVariables) {
    if (!this.enable) return;

    const startLine = node?.loc?.start?.line || {};
    const startColumn = node?.loc?.start?.column || {};
    const endLine = node?.loc?.end?.line || {};
    const endColumn = node?.loc?.end?.column || {}

    console.log(`throw an error: ${(startLine)} (${startColumn}) - ${endLine} (${endColumn})`
      , { declaredVariables, error, range: node.range });
  }


}

module.exports = Logger;
