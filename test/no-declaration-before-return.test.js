const eslint = require('eslint');
const fs = require('fs');
const noDeclarationBeforeReturn = require('../lib/no-declaration-before-return/no-declaration-before-return');
const Logger = require('../lib/no-declaration-before-return/parser/logger');

const tester = new eslint.RuleTester({
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
});

// Valid
const validDir = `${__dirname}/test-data/valid/`;
const validFunction = fs.readFileSync(`${validDir}valid-function-1.js`, 'utf-8');
const objectPattern = fs.readFileSync(`${validDir}object-pattern.js`, 'utf-8');
const unaryExpression = fs.readFileSync(`${validDir}unary-expression.js`, 'utf-8');
const unaryExpression2 = fs.readFileSync(`${validDir}unary-expression-2.js`, 'utf-8');
const binaryExpression = fs.readFileSync(`${validDir}binary-expression.js`, 'utf-8');
const conditionalExpression = fs.readFileSync(`${validDir}conditional-expression.js`, 'utf-8');
const complicatedDeclaration = fs.readFileSync(`${validDir}complicated-declaration.js`, 'utf-8');
const strangeDeclaration = fs.readFileSync(`${validDir}strange-declaration.js`, 'utf-8');
const renamedDeclaration = fs.readFileSync(`${validDir}rename-declaration.js`, 'utf-8');
const noReturn = fs.readFileSync(`${validDir}no-return.js`, 'utf-8');
const strangeCallExpression = fs.readFileSync(`${validDir}strange-call-expression.js`, 'utf-8');
const objectExpression = fs.readFileSync(`${validDir}object-expression.js`, 'utf-8');
const arrayExpression = fs.readFileSync(`${validDir}array-expression.js`, 'utf-8');
const forOfStatement = fs.readFileSync(`${validDir}for-of-statement.js`, 'utf-8');
const switchStatement = fs.readFileSync(`${validDir}switch-statement.js`, 'utf-8');
const throwExpression = fs.readFileSync(`${validDir}throw-expression.js`, 'utf-8');

const complicatedSwitch = fs.readFileSync(`${validDir}complicated-switch.js`, 'utf-8');
const complicatedIf = fs.readFileSync(`${validDir}complicated-if.js`, 'utf-8');
const tryCatchComlicated = fs.readFileSync(`${validDir}try-catch-complicated.js`, 'utf-8');
const strange1 = fs.readFileSync(`${validDir}strange1.js`, 'utf-8');
const arrowFunction = fs.readFileSync(`${validDir}arrow-function.js`, 'utf-8');

const forStatement = fs.readFileSync(`${validDir}for-statement.js`, 'utf-8');

// Invalid
const invalidDir = `${__dirname}/test-data/invalid/`;
const invalidFunction1 = fs.readFileSync(`${invalidDir}invalid-function-1.js`, 'utf-8');
const invalidFunction2 = fs.readFileSync(`${invalidDir}invalid-function-2.js`, 'utf-8');
const complicatedIfInvalid = fs.readFileSync(`${invalidDir}complicated-if-invalid.js`, 'utf-8');

// const problem = fs.readFileSync(`${validDir}problem.js`, 'utf-8');

const enable = process.env.ESLINT_LOGGING || false;
Logger.init({ enable });

tester.run('no-declaration-before-return', noDeclarationBeforeReturn.default, {
  valid: [
    // { code: validFunction },
    // { code: objectPattern },
    // { code: unaryExpression },
    // { code: unaryExpression2 },
    // { code: binaryExpression },
    // { code: conditionalExpression },
    // { code: complicatedDeclaration },
    // { code: noReturn },
    // { code: renamedDeclaration },
    // { code: strangeCallExpression },
    // { code: objectExpression },
    // { code: arrayExpression },

    // { code: strangeDeclaration },
    // { code: switchStatement },
    // // { code: problem },
    // { code: throwExpression },
    // { code: complicatedSwitch },
    // { code: complicatedIf },

    // { code: strange1 },
    { code: forStatement },
  ],
  invalid: [
    // { code: invalidFunction1, errors: [{ messageId: 'noDeclarationBeforeReturn' }] },
    // { code: invalidFunction2, errors: [{ messageId: 'noDeclarationBeforeReturn' }] },
    // { code: complicatedIfInvalid, errors: [{ messageId: 'noDeclarationBeforeReturn' }] },
  ],
});
