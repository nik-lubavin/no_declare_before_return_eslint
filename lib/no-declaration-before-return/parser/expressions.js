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

function parseAnyExpression(node, declaredVariables) {
  if (node.type === 'LogicalExpression') {
    Logger.logParsingNode(node);

    // at first extract all the non-logical Expressions with identifiers
    const nonLogicalExpressions = [];
    _parseLogicalExpression(node, nonLogicalExpressions);
    (nonLogicalExpressions || []).forEach((expression) => {
      _parseNonLogicalExpression(expression, declaredVariables);
    });
  } else {
    _parseNonLogicalExpression(node, declaredVariables);
  }
}

function _parseNonLogicalExpression(node, declaredVariables) {
  Logger.logParsingNode(node);

  switch (node.type) {
    case 'UnaryExpression': {
      _finalizeUnaryExpression(node, declaredVariables);
      break;
    }
    case 'ChainExpression': {
      parseAnyExpression(node.expression, declaredVariables);
      break;
    }
    case 'MemberExpression': {
      parseAnyExpression(node.object, declaredVariables);
      parseAnyExpression(node.property, declaredVariables);
      break;
    }

    case 'AssignmentExpression':
    case 'BinaryExpression': {
      parseAnyExpression(node.left, declaredVariables);
      parseAnyExpression(node.right, declaredVariables);
      break;
    }

    case 'CallExpression': {
      parseAnyExpression(node.callee, declaredVariables);
      (node.arguments || []).forEach((arg) => {
        parseAnyExpression(arg, declaredVariables);
      });
      break;
    }

    case 'ArrowFunctionExpression': {
      if (node.body.type === 'BlockStatement') {
        parseBlockStatement(node.body, declaredVariables);
      } else {
        // is Expression
        parseAnyExpression(node.body, declaredVariables);
      }
      break;
    }

    case 'ConditionalExpression': {
      parseAnyExpression(node.test, declaredVariables);
      parseAnyExpression(node.consequent, declaredVariables);
      parseAnyExpression(node.alternate, declaredVariables);
      break;
    }

    case 'ObjectExpression': {
      (node.properties || []).forEach((elementExpression) => parseAnyExpression(
        elementExpression,
        declaredVariables,
      ));
      break;
    }

    case 'ArrayExpression': {
      (node.elements || []).forEach((element) => {
        parseAnyExpression(element, declaredVariables);
      });
      break;
    }

    case 'TemplateLiteral': {
      (node.expressions || [])
        .forEach((elementExpression) => {
          parseAnyExpression(
            elementExpression,
            declaredVariables,
          );
        });
      break;
    }

    case 'Property': {
      parseAnyExpression(node.value, declaredVariables);
      break;
    }

    case 'Identifier': {
      identifiers.parseIdentifier(node, declaredVariables);
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
      identifiers.parseArrayOfIdentifiers(curIdentifiers, declaredVariables);
    }
  }
}

function _finalizeUnaryExpression(node, declaredVariables) {
  if (node.argument.type === 'Identifier') {
    identifiers.parseIdentifier(node.argument, declaredVariables);
  } else {
    parseAnyExpression(node.argument, declaredVariables);
  }
}

exports.parse_AnyExpression = parseAnyExpression;
