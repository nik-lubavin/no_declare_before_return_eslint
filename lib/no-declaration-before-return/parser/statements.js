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
  expressions.parse_AnyExpression(node.test, declaredVariables);
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
  for (const element of node.body) {
    const parsingGoesOn = parseAnyStatement(element, declaredVariables, context);

    if (!parsingGoesOn) { break; }
  }
}

function parseAnyStatement(node, declaredVariables, context) {
  switch (node.type) {
    case 'VariableDeclaration':
      declarations.parse_VariableDeclaration(node, declaredVariables);
      break;
    case 'ExpressionStatement':
      parseExpressionStatement(node, declaredVariables);
      break;
    case 'IfStatement':
      parseIfStatement(node, declaredVariables, context);
      // checking only this section, because it looks like it's the only place where ReturnStatement can impact
      if (checkReturn(declaredVariables, context, node)) {
        Logger.logString('parsingStopped');
        return false;
      }
      break;
    case 'ReturnStatement':
      parseReturnStatement(node, declaredVariables);
      break;
    case 'ForOfStatement':
      parseForOfStatement(node, declaredVariables);
      break;
    case 'SwitchStatement': {
      parseSwitchCaseStatement(node, declaredVariables, context);
      break;
    }
    default:
      break;
  }

  return true;
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

function parseForOfStatement(node, declaredVariables) {
  if (node.left.type === 'Identifier') {
    // It looks like it's the only interesting option
    identifiers.parseIdentifier(node.left, declaredVariables);
  }

  // Everything could be here, incl Identifier
  expressions.parse_AnyExpression(node.right, declaredVariables);
  if (node.body.type === 'BlockStatement') {
    parseBlockStatement(node.body, declaredVariables);
  } else {
    expressions.parse_AnyExpression(node.body, declaredVariables);
  }
}

function parseSwitchCaseStatement(node, declaredVariables, context) {
  Logger.logParsingNode(node, '1');
  // discriminant
  expressions.parse_AnyExpression(node.discriminant, declaredVariables);

  // cases
  node.cases.forEach((element) => {
    // switch case element

    // test section
    if (element.test) expressions.parse_AnyExpression(element.test, declaredVariables);

    // consequent
    element.consequent.forEach((statement) => {
      parseAnyStatement(statement, declaredVariables, context);
    });
  });
}

exports.parseBlockStatement = parseBlockStatement;
