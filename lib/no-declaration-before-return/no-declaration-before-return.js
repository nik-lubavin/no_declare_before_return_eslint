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
      functions.parse_FunctionDeclaration(node, context);
    },
    FunctionExpression: (node) => {
      functions.parse_FunctionExpression(node, context);
    },
  }),
};

exports.default = rule;
