const noDeclarationBeforeReturn = require('./no-declaration-before-return/no-declaration-before-return');

module.exports = {
  rules: {
    'no-declaration-before-return': noDeclarationBeforeReturn.default,
  },
};
