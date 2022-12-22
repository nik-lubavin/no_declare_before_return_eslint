const { AccumulatedMetadataFactory } = require('./accumulated-metadata');
const expressions = require('./expressions');
const Logger = require('./logger');

const accumulatedMetadata = AccumulatedMetadataFactory.getInstance();

function _declareIdentifier(node) {
  if (!node) return;
  const { name } = node;
  if (!accumulatedMetadata.checkVariable(name)) {
    accumulatedMetadata.setVariable(name, node);

    Logger.addedVariable(node, name);
  }
}

function parseVariableDeclaration(node) {
  // parsing declaration part
  Logger.logParsingNode(node);
  const declId = node.declarations[0].id;

  if (declId.type === 'Identifier') {
    _declareIdentifier(declId);
  } else if (declId.type === 'ObjectPattern') {
    declId.properties.forEach((item) => {
      const currNode = item.value;
      _declareIdentifier(currNode);
    });
  } else if (declId.type === 'ArrayPattern') {
    declId.elements.forEach((item) => _declareIdentifier(item));
  } else {
    Logger.error('Error  Unsupported declaration type');
  }
  // parsing init part
  const initExpression = node.declarations[0].init;
  if (initExpression) {
    expressions.parse_AnyExpression(initExpression);
  }
}
exports.parse_VariableDeclaration = parseVariableDeclaration;
