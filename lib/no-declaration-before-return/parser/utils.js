const { DEBUG_LOGGING } = require('./constants');
const Logger = require('./logger');

function checkReturn(declaredVariables, context) {
  const entries = Object.entries(declaredVariables.variables);
  if (declaredVariables.return && entries.length) {
    const entry = entries[0];
    const error = entry[0];
    const currNode = entry[1];
    Logger.lintReport(currNode, error, declaredVariables);
    context.report({
      messageId: 'noDeclarationBeforeReturn', node: currNode,
    });
    return true;
  }

  declaredVariables.return = false;
  return false;
}

exports.checkReturn = checkReturn;
