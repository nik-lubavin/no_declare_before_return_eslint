const expressions = require('./expressions');
const Logger = require('./logger');

function _declareIdentifier(node, declaredVariables) {
  const { name } = node;
  if (!declaredVariables.variables[name]) {
    declaredVariables.variables[name] = node;

    Logger.addedVariable(node, name);
  }
}

function parseVariableDeclaration(node, declaredVariables) {
  // parsing declaration part
  Logger.logParsingNode(node);
  const declId = node.declarations[0].id;

  if (declId.type === 'Identifier') {
    _declareIdentifier(declId, declaredVariables);
  } else if (declId.type === 'ObjectPattern') {
    declId.properties.forEach((item) => {
      const currNode = item.value;
      _declareIdentifier(currNode, declaredVariables);
    });
  } else if (declId.type === 'ArrayPattern') {
    declId.elements.forEach((item) => _declareIdentifier(item, declaredVariables));
  } else {
    Logger.error('Error  Unsupported declaration type');
  }
  // parsing init part
  const initExpression = node.declarations[0].init;
  if (initExpression) {
    expressions.parse_AnyExpression(initExpression, declaredVariables);
  }
}
exports.parse_VariableDeclaration = parseVariableDeclaration;
