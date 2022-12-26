const statements = require('./statements');

function parseFunctionDeclaration(node) {
  statements.parseBlockStatement(node.body);
}

function parseFunctionExpression(node) {
  statements.parseBlockStatement(node.body);
}

exports.parse_FunctionDeclaration = parseFunctionDeclaration;
exports.parse_FunctionExpression = parseFunctionExpression;
