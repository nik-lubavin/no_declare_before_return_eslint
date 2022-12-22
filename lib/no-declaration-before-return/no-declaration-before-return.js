const { AccumulatedMetadataFactory } = require('./parser/accumulated-metadata');
const functions = require('./parser/functions');

const accumulatedMetadata = AccumulatedMetadataFactory.getInstance();

const rule = {
  meta: {
    messages: {
      noDeclarationBeforeReturn: 'Do not declare variables before possible return. Consider moving this declaration after return',
    },
    fixable: 'code',
  },
  create: (context) => ({
    FunctionDeclaration: (node) => {
      accumulatedMetadata.init();

      functions.parse_FunctionDeclaration(node, context);
    },
    FunctionExpression: (node) => {
      accumulatedMetadata.init();

      functions.parse_FunctionExpression(node, context);
    },
  }),
};

exports.default = rule;
