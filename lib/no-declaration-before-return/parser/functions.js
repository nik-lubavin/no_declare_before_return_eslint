const statements = require('./statements');

function parseFunctionDeclaration(node, context) {
  statements.parseBlockStatement(node.body, context);
}

function parseFunctionExpression(node, context) {
  statements.parseBlockStatement(node.body, context);
}

exports.parse_FunctionDeclaration = parseFunctionDeclaration;
exports.parse_FunctionExpression = parseFunctionExpression;
