const { declaredVariables } = require('./parser/constants');
const functions = require('./parser/functions');

const rule = {
  meta: {
    messages: {
      noDeclarationBeforeReturn: 'Do not declare variables before Return',
    },
    fixable: 'code',
  },
  create: (context) => ({
    FunctionDeclaration: (node) => {
      declaredVariables.return = false;
      declaredVariables.variables = {};

      functions.parse_FunctionDeclaration(node, context);

      declaredVariables.return = false;
      declaredVariables.variables = {};
    },
    FunctionExpression: (node) => {
      declaredVariables.return = false;
      declaredVariables.variables = {};

      functions.parse_FunctionExpression(node, context);

      declaredVariables.return = false;
      declaredVariables.variables = {};
    },
  }),
};

exports.default = rule;
