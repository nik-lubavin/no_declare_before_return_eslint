/* eslint-disable no-use-before-define */
const identifiers = require('./identifiers');
const Logger = require('./logger');
const { parseBlockStatement } = require('./statements');

function _parseLogicalExpression(node, result) {
  if (node.left.type === 'LogicalExpression') {
    // going recursive
    _parseLogicalExpression(node.left, result);
  } else {
    result.push(node.left);
  }
  // right side can not be a logical expression
  result.push(node.right);
  return result;
}

function parseAnyExpression(node) {
  if (node.type === 'LogicalExpression') {
    Logger.logParsingNode(node);

    // at first extract all the non-logical Expressions with identifiers
    const nonLogicalExpressions = [];
    _parseLogicalExpression(node, nonLogicalExpressions);
    (nonLogicalExpressions || []).forEach((expression) => {
      _parseNonLogicalExpression(expression);
    });
  } else {
    _parseNonLogicalExpression(node);
  }
}

function _parseNonLogicalExpression(node) {
  Logger.logParsingNode(node);

  switch (node.type) {
    case 'UnaryExpression': {
      _finalizeUnaryExpression(node);
      break;
    }
    case 'ChainExpression': {
      parseAnyExpression(node.expression);
      break;
    }
    case 'MemberExpression': {
      parseAnyExpression(node.object);
      parseAnyExpression(node.property);
      break;
    }

    case 'AssignmentExpression':
    case 'BinaryExpression': {
      parseAnyExpression(node.left);
      parseAnyExpression(node.right);
      break;
    }

    case 'CallExpression': {
      parseAnyExpression(node.callee);
      (node.arguments || []).forEach((arg) => {
        parseAnyExpression(arg);
      });
      break;
    }

    case 'ArrowFunctionExpression': {
      if (node.body.type === 'BlockStatement') {
        parseBlockStatement(node.body);
      } else {
        // is Expression
        parseAnyExpression(node.body);
      }
      break;
    }

    case 'ConditionalExpression': {
      parseAnyExpression(node.test);
      parseAnyExpression(node.consequent);
      parseAnyExpression(node.alternate);
      break;
    }

    case 'ObjectExpression': {
      (node.properties || []).forEach((elementExpression) => parseAnyExpression(
        elementExpression,

      ));
      break;
    }

    case 'ArrayExpression': {
      (node.elements || []).forEach((element) => {
        parseAnyExpression(element);
      });
      break;
    }

    case 'TemplateLiteral': {
      (node.expressions || [])
        .forEach((elementExpression) => {
          parseAnyExpression(
            elementExpression,
          );
        });
      break;
    }

    case 'Property': {
      parseAnyExpression(node.value);
      break;
    }

    case 'Identifier': {
      identifiers.parseIdentifier(node);
      break;
    }

    case 'Literal':
      // doing nothing
      break;

    default: {
      Logger.logParsingNode(node, 'thats default');
      // Just looking for identifiers everywhere
      const candidates = [
        node,
        node.left, node.right,
        node.callee, node.arguments,
        node.argument, // update expression
      ];

      const curIdentifiers = identifiers.identifierFilter(candidates);
      identifiers.parseArrayOfIdentifiers(curIdentifiers);
    }
  }
}

function _finalizeUnaryExpression(node) {
  if (node.argument.type === 'Identifier') {
    identifiers.parseIdentifier(node.argument);
  } else {
    parseAnyExpression(node.argument);
  }
}

exports.parse_AnyExpression = parseAnyExpression;
