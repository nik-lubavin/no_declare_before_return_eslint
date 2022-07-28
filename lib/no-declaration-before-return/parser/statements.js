exports.parseBlockStatement = () => { };

const { declaredVariables } = require('./constants');
/* eslint-disable no-use-before-define */
const declarations = require('./declarations');
const expressions = require('./expressions');
const identifiers = require('./identifiers');
const Logger = require('./logger');
const { checkReturn } = require('./utils');

function parseExpressionStatement(node) {
  expressions.parse_AnyExpression(node.expression);
}

function parseIfStatement(node, context) {
  // parsing test section
  expressions.parse_AnyExpression(node.test);
  // parsing consequent
  const { consequent } = node;
  if (consequent.type === 'BlockStatement') {
    parseBlockStatement(consequent, context);
  } else if (consequent.type === 'ExpressionStatement') {
    // expression
    (0, expressions.parse_AnyExpression)(consequent.expression);
  }
  // going into a recurse, parsing "else if" clauses
  const { alternate } = node;
  if (alternate) {
    if (alternate.type === 'IfStatement') {
      parseIfStatement(alternate, context);
    } else if (alternate.type === 'ExpressionStatement') {
      (0, expressions.parse_AnyExpression)(alternate.expression);
    }
  }
}

function parseBlockStatement(node, context) {
  for (const element of node.body) {
    const parsingGoesOn = parseAnyStatement(element, context);

    if (!parsingGoesOn) { break; }
  }
}

function parseAnyStatement(node, context) {
  switch (node.type) {
    case 'VariableDeclaration':
      declarations.parse_VariableDeclaration(node);
      break;
    case 'ExpressionStatement':
      parseExpressionStatement(node);
      break;
    case 'IfStatement':
      parseIfStatement(node, context);
      // checking only this section, because it looks like it's the only place where ReturnStatement can impact
      if (checkReturn(context)) {
        Logger.logString('parsingStopped');
        return false;
      }
      break;
    case 'ReturnStatement':
      parseReturnStatement(node);
      break;
    case 'ForOfStatement':
      parseForOfStatement(node, context);
      break;
    case 'SwitchStatement':
      parseSwitchCaseStatement(node, context);
      break;
    case 'ThrowStatement':
      parseThrowStatement(node);
      break;
    default:
      break;
  }

  return true;
}

function parseReturnStatement(node) {
  if (node.argument) {
    if (node.argument?.type === 'Identifier') {
      identifiers.parseIdentifier(node.argument);
    } else {
      expressions.parse_AnyExpression(node.argument);
    }
  }

  declaredVariables.return = true;
}

function parseForOfStatement(node, context) {
  if (node.left.type === 'Identifier') {
    // It looks like it's the only interesting option
    identifiers.parseIdentifier(node.left);
  }

  // Everything could be here, incl Identifier
  expressions.parse_AnyExpression(node.right);
  if (node.body.type === 'BlockStatement') {
    parseBlockStatement(node.body, context);
  } else {
    expressions.parse_AnyExpression(node.body);
  }
}

function parseSwitchCaseStatement(node, context) {
  // discriminant
  expressions.parse_AnyExpression(node.discriminant);

  // cases
  node.cases.forEach((element) => {
    // switch case element

    // test section
    if (element.test) expressions.parse_AnyExpression(element.test);

    // consequent
    element.consequent.forEach((statement) => {
      parseAnyStatement(statement, context);
    });
  });
}

function parseThrowStatement(node) {
  expressions.parse_AnyExpression(node.argument);
}

exports.parseBlockStatement = parseBlockStatement;
