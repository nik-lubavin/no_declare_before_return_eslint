/* eslint-disable no-use-before-define */
const { AccumulatedMetadataFactory } = require('./accumulated-metadata');
const identifiers = require('./identifiers');
const Logger = require('./logger');

// Resolving circular
let expressions = null;
let declarations = null;
const accumulatedMetadata = AccumulatedMetadataFactory.getInstance();

// MAIN
function parseBlockStatement(node) {
  if (!expressions) {
    expressions = require('./expressions');
  }

  if (!declarations) {
    declarations = require('./declarations');
  }
  Logger.logParsingNode(node);
  for (const element of node.body) {
    // parse next element of body
    parseAnyStatement(element);

    if (accumulatedMetadata.getFullStop()) {
      Logger.logString('parsingStopped', element);
      return;
    }
  }
}

function parseAnyStatement(node) {
  Logger.logParsingNode(node);
  switch (node?.type) {
    case 'BlockStatement':
      parseBlockStatement(node);
      break;
    case 'VariableDeclaration':
      declarations.parse_VariableDeclaration(node);
      break;
    case 'ExpressionStatement':
      parseExpressionStatement(node);
      break;
    case 'IfStatement':
      // We want to check the validity of return only after parsing is finished for all Clauses (IF, SWITCH)
      // So we make a decision only on level 0 (same level as var is declared)
      // That's why we modify levels of declared variables
      accumulatedMetadata.levelUp();

      parseIfStatement(node);
      // We could get full stop inside IF in recurse
      if (accumulatedMetadata.getFullStop()) {
        return;
      }

      accumulatedMetadata.levelDown();

      accumulatedMetadata.checkReturn();

      break;

    case 'SwitchStatement':
      accumulatedMetadata.levelUp();

      parseSwitchCaseStatement(node);
      if (accumulatedMetadata.getFullStop()) {
        return;
      }

      accumulatedMetadata.levelDown();

      accumulatedMetadata.checkReturn();
      break;

    case 'TryStatement':
      accumulatedMetadata.levelUp();

      parseTryStatement(node);

      accumulatedMetadata.levelDown();

      accumulatedMetadata.checkReturn();
      break;
    case 'ReturnStatement':
      parseReturnStatement(node);
      break;
    case 'ForOfStatement':
      parseForOfStatement(node);
      break;

    case 'ForStatement':
      parseForStatement(node);
      break;

    case 'ThrowStatement':
      parseThrowStatement(node);
      break;

    default:
      Logger.logString('Possible error - No case for this Node', node);
      break;
  }
}

function parseExpressionStatement(node) {
  expressions.parse_AnyExpression(node.expression);
}

function parseIfStatement(node) {
  // parsing test section
  expressions.parse_AnyExpression(node.test);
  // parsing consequent
  const { consequent } = node;
  if (consequent.type === 'BlockStatement') {
    parseBlockStatement(consequent);
  } else if (consequent.type === 'ExpressionStatement') {
    // expression
    expressions.parse_AnyExpression(consequent.expression);
  }
  // going into a recurse, parsing "else if" clauses
  const { alternate } = node;
  if (alternate) {
    if (alternate.type === 'IfStatement') {
      parseIfStatement(alternate);
    } else if (alternate.type === 'BlockStatement') {
      parseBlockStatement(alternate);
    } else if (alternate.type === 'ExpressionStatement') {
      expressions.parse_AnyExpression(alternate.expression);
    }
  }
}

function parseReturnStatement(node) {
  if (node.argument) {
    if (node.argument?.type === 'Identifier') {
      identifiers.parseIdentifier(node.argument);
    } else {
      expressions.parse_AnyExpression(node.argument);
    }
  }

  accumulatedMetadata.setReturnFlag();
}

function parseForOfStatement(node) {
  if (node.left.type === 'Identifier') {
    // It looks like it's the only interesting option
    identifiers.parseIdentifier(node.left);
  }

  expressions.parse_AnyExpression(node.right);
  if (node.body.type === 'BlockStatement') {
    parseBlockStatement(node.body);
  } else {
    expressions.parse_AnyExpression(node.body);
  }
}

function parseForStatement(node) {
  declarations.parse_VariableDeclaration(node.init);
  expressions.parse_AnyExpression(node.test);
  expressions.parse_AnyExpression(node.update);

  parseBlockStatement(node.body);
}

function parseSwitchCaseStatement(node) {
  // discriminant
  expressions.parse_AnyExpression(node.discriminant);

  // cases
  node.cases.forEach((element) => {
    // test section
    if (element.test) expressions.parse_AnyExpression(element.test);

    // consequent
    element.consequent.forEach((statement) => {
      parseAnyStatement(statement);
    });
  });
}

function parseThrowStatement(node) {
  expressions.parse_AnyExpression(node.argument);
}

function parseTryStatement(node) {
  parseAnyStatement(node.block);
  parseAnyStatement(node.handler?.body);
}

exports.parseBlockStatement = parseBlockStatement;
