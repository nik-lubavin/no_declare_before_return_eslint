class Logger {
  static enable = false;
  static startingLine;
  static endingLine;

  static init(options) {
    if (options.enable) {
      this.enable = options.enable;
    }

    if (options.startingLine) {
      this.startingLine = options.startingLine;
    }

    if (options.endingLine) {
      this.endingLine = options.endingLine;
    }
  }

  static checkNode(node) {
    // if (this.startingLine && node.loc.start.line < this.startingLine) {
    //   console.log('false', node.loc.start.line );
    //   return false;
    // }

    // if (this.endingLine && node.loc.start.line > this.endingLine) {
    //   return false;
    // }
    // 
    if (node.loc.start.line >= 13) return true;
    else return false

    return true;
  }

  static logParsingNode(node, extra = '') {
    if (!this.enable) return;
    if (!this.checkNode(node)) return;

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
    if (!this.checkNode(node)) return;

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
    if (!this.checkNode(node)) return;

    console.log(console.log(`Added variable ${name} (${node.loc?.start?.line} - ${node.loc?.end?.line})`));
  }

  static removedVariable(node, name, declaredVariables) {
    if (!this.enable) return;
    if (!this.checkNode(node)) return;

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
