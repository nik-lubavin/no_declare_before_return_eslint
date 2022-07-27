import { RuleTester } from "eslint";
import { readFileSync } from "fs";
import rule from './no-declaration-before-return';

const tester = new RuleTester({
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    }
});

const validCode =
    `const {smth} = require('package')
    function valid() {
        const a = func()
        return a
    }`;

// Valid
const validDir = `${__dirname}/test-data/valid/`;
const validFunction = readFileSync(`${validDir}valid-function-1.js`, 'utf-8');
const objectPattern = readFileSync(`${validDir}object-pattern.js`, 'utf-8');
const unaryExpression = readFileSync(`${validDir}unary-expression.js`, 'utf-8');
const unaryExpression2 = readFileSync(`${validDir}unary-expression-2.js`, 'utf-8');

const binaryExpression = readFileSync(`${validDir}binary-expression.js`, 'utf-8');
const conditionalExpression = readFileSync(`${validDir}conditional-expression.js`, 'utf-8');

const complicatedDeclaration = readFileSync(`${validDir}complicated-declaration.js`, 'utf-8');
const strangeDeclaration = readFileSync(`${validDir}strange-declaration.js`, 'utf-8');
const renamedDeclaration = readFileSync(`${validDir}rename-declaration.js`, 'utf-8');

const noReturn = readFileSync(`${validDir}no-return.js`, 'utf-8');

const strangeCallExpression = readFileSync(`${validDir}strange-call-expression.js`, 'utf-8');

const objectExpression = readFileSync(`${validDir}object-expression.js`, 'utf-8');

// Invalid
const invalidFunction1 = readFileSync(`${__dirname}/test-data/invalid-function-1.js`, 'utf-8');
const invalidFunction2 = readFileSync(`${__dirname}/test-data/invalid-function-2.js`, 'utf-8');

tester.run('no-declaration-before-return', rule, {
    valid: [
        // { code: validFunction },
        // { code: objectPattern },
        // { code: unaryExpression },
        // { code: unaryExpression2 },
        // { code: binaryExpression },
        // { code: conditionalExpression },

        // { code: complicatedDeclaration },
        // { code: noReturn },
        // { code: strangeDeclaration },
        // { code: renamedDeclaration },
        // { code: strangeCallExpression },
        { code: objectExpression }
    ],
    invalid: [
        // { code: invalidFunction1, errors: [{ messageId: 'noDeclarationBeforeReturn' }] },
        // { code: invalidFunction2, errors: [{ messageId: 'noDeclarationBeforeReturn' }] },
    ]
});