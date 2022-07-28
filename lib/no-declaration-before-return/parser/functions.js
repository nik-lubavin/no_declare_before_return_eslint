const statements = require('./statements');
// FUNCTIONS
function parseFunctionDeclaration(node, context) {
  const declaredVariables = { return: false, variables: {} };
  statements.parseBlockStatement(node.body, declaredVariables, context);
}

function parseFunctionExpression(node, context) {
  const declaredVariables = { return: false, variables: {} };
  statements.parseBlockStatement(node.body, declaredVariables, context);
}

exports.parse_FunctionDeclaration = parseFunctionDeclaration;
exports.parse_FunctionExpression = parseFunctionExpression;
