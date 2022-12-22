const { AccumulatedMetadataFactory } = require('./accumulated-metadata');
const Logger = require('./logger');

const accumulatedMetadata = AccumulatedMetadataFactory.getInstance();
function parseIdentifier(node) {
  if (accumulatedMetadata.checkVariable(node.name)) {
    accumulatedMetadata.deleteVariable(node.name);

    Logger.removedVariable(node, node.name, accumulatedMetadata.getVariables());
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
