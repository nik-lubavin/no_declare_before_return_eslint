class Logger {
  static enable = false;
  static startingLine;
  static endingLine;
  static metadata;

  static init(options) {
    if (!this.metadata) {
      const { AccumulatedMetadataFactory } = require('./accumulated-metadata');
      this.metadata = AccumulatedMetadataFactory.getInstance();
    }
    
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

  static logParsingNode(node, extra = '') {
    if (!this.enable) return;
    // if (!this.checkNode(node)) return;

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
    // if (!this.checkNode(node)) return;

    const startLine = node.loc?.start?.line || 0;
    const endLine = node.loc?.end?.line || 0;
    console.log('parsing block:', {
      type: node.type,
      startLine,
      endLine,
      blockBody: node.body,
    });
  }

  static logString(str, node = undefined) {
    if (!this.enable) return;

    const extra = node ? { type: node.type, start: node.loc?.start?.line, end: node.loc?.end?.line } : '';

    console.log(str, extra);
  }

  static addedVariable(node, name) {
    if (!this.enable) return;

    console.log(`Added variable "${name}" (${node.loc?.start?.line} - ${node.loc?.end?.line})`,
      { vars: this.metadata.getVariables() });
  }

  static removedVariable(node, name, vars) {
    if (!this.enable) return;

    console.log(
      `Removed variable ${name} (${node.loc?.start?.line} - ${node.loc?.end?.line})`,
      { vars: this.metadata.getVariables() }
    );
  }

  static error(msg) {
    if (!this.enable) return;

    console.error(msg);
  }

  static errorReport(node, variables) {
    if (!this.enable) return;

    const startLine = node?.loc?.start?.line || {};
    const startColumn = node?.loc?.start?.column || {};
    const endLine = node?.loc?.end?.line || {};
    const endColumn = node?.loc?.end?.column || {}

    console.log(`throw an error: ${(startLine)} (${startColumn}) - ${endLine} (${endColumn})`
      , {
        range: node.range,
        variables,
      });
  }


}

module.exports = Logger;
