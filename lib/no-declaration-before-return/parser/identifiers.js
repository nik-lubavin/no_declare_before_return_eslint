const { declaredVariables } = require('./constants');
const Logger = require('./logger');

function parseIdentifier(node) {
  if (declaredVariables.variables[node.name]) {
    delete declaredVariables.variables[node.name];
    Logger.removedVariable(node, node.name);
  }
}

function parseArrayOfIdentifiers(identifiers) {
  identifiers.forEach((identifier) => parseIdentifier(identifier));
}

function identifierFilter(arr) {
  return arr.flat().filter((item) => !!item).filter((item) => item.type === 'Identifier');
}

exports.parseArrayOfIdentifiers = parseArrayOfIdentifiers;
exports.parseIdentifier = parseIdentifier;
exports.identifierFilter = identifierFilter;
