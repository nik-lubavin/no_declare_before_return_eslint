exports.parseBlockStatement = () => { };

/* eslint-disable no-use-before-define */
const declarations = require('./declarations');
const expressions = require('./expressions');
const identifiers = require('./identifiers');
const Logger = require('./logger');
const { checkReturn } = require('./utils');

function parseExpressionStatement(node, declaredVariables) {
  expressions.parse_AnyExpression(node.expression, declaredVariables);
}

function parseIfStatement(node, declaredVariables, context) {
  // parsing test section
  (0, expressions.parse_AnyExpression)(node.test, declaredVariables);
  // parsing consequent
  const { consequent } = node;
  if (consequent.type === 'BlockStatement') {
    parseBlockStatement(consequent, declaredVariables, context);
  } else if (consequent.type === 'ExpressionStatement') {
    // expression
    (0, expressions.parse_AnyExpression)(consequent.expression, declaredVariables);
  }
  // going into a recurse, parsing "else if" clauses
  const { alternate } = node;
  if (alternate) {
    if (alternate.type === 'IfStatement') {
      parseIfStatement(alternate, declaredVariables, context);
    } else if (alternate.type === 'ExpressionStatement') {
      (0, expressions.parse_AnyExpression)(alternate.expression, declaredVariables);
    }
  }
}

function parseBlockStatement(node, declaredVariables, context) {
  Logger.logParsingBlock(node);
  for (const element of node.body) {
    Logger.logParsingNode(element, 'block body element');
    let parsingGoesOn = true;
    switch (element.type) {
      case 'VariableDeclaration':
        declarations.parse_VariableDeclaration(element, declaredVariables);
        break;
      case 'ExpressionStatement':
        parseExpressionStatement(element, declaredVariables);
        break;
      case 'IfStatement':
        parseIfStatement(element, declaredVariables, context);
        if (checkReturn(declaredVariables, context, element)) {
          Logger.logString('parsingStopped');
          parsingGoesOn = false;
        }
        break;
      case 'ReturnStatement':
        parseReturnStatement(element, declaredVariables);
        break;
      default:
        break;
    }
    if (!parsingGoesOn) { break; }
  }
}

function parseReturnStatement(node, declaredVariables) {
  if (node.argument) {
    if (node.argument?.type === 'Identifier') {
      identifiers.parseIdentifier(node.argument, declaredVariables);
    } else {
      expressions.parse_AnyExpression(node.argument, declaredVariables);
    }
  }

  declaredVariables.return = true;
}

exports.parseBlockStatement = parseBlockStatement;