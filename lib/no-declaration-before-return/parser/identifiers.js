const { DEBUG_LOGGING } = require('./constants');
const Logger = require('./logger');

function parseIdentifier(node, declaredVariables) {
  if (declaredVariables.variables[node.name]) {
    delete declaredVariables.variables[node.name];
    Logger.removedVariable(node, node.name, declaredVariables);
  }
}

function parseArrayOfIdentifiers(identifiers, declaredVariables) {
  identifiers.forEach((identifier) => parseIdentifier(identifier, declaredVariables));
}

function identifierFilter(arr) {
  return arr.flat().filter((item) => !!item).filter((item) => item.type === 'Identifier');
}

exports.parseArrayOfIdentifiers = parseArrayOfIdentifiers;
exports.parseIdentifier = parseIdentifier;
exports.identifierFilter = identifierFilter;
