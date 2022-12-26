const Logger = require('./logger');

module.exports.AccumulatedMetadataFactory = class AccumulatedMetadataFactory {
  static instance = null;
  static getInstance() {
    if (!this.instance) {
      this.instance = new AccumulatedMetadata();
    }

    return this.instance;
  }
}

class AccumulatedMetadata {
  constructor() {
    this.init();
  }

  init(context) {
    this._returnFlag = false;
    this._variables = {};
    this._fullStop = false;
    this._context = context;
  }

  // Return flag

  setReturnFlag(value = true) {
    this._returnFlag = value;
  }

  getReturnFlag() {
    return this._returnFlag;
  }

  checkReturn() {
    // if return flag activated
    if (this.getReturnFlag()) {
      // Current registered variables
      const vars = Object.values(this._variables);
      if (vars.length) {
        // Variables with 0 level, so to speak declared at the same level, not before current if for instance
        const zeroLevel = vars.filter((variable) => (variable.level === 0));
        if (zeroLevel.length) {
          const curNode = zeroLevel[0].node;
          Logger.errorReport(curNode, zeroLevel);
          this._context.report({
            messageId: 'noDeclarationBeforeReturn', node: curNode,
          });

          // stopping parsing
          this.setFullStop();
        }
      } else {
        // there is no vars in metadata - switch return off
        this.setReturnFlag(false);
      }
    }

    return false;
  }

  // Variables

  checkVariable(variableName) {
    return !!this._variables[variableName];
  }

  setVariable(variableName, node) {
    this._variables[variableName] = { node, level: 0 };
  }

  deleteVariable(variableName) {
    delete this._variables[variableName];
  }

  getVariables() {
    return this._variables;
  }

  levelUp() {
    for (const obj of Object.values(this._variables)) {
      obj.level += 1;
    }
  }

  levelDown() {
    for (const obj of Object.values(this._variables)) {
      obj.level -= 1;
    }
  }

  // Full stop

  getFullStop() {
    return this._fullStop;
  }

  setFullStop(value = true) {
    this._fullStop = value;
  }
}