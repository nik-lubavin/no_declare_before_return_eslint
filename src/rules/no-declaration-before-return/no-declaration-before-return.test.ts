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


const validDir = `${__dirname}/test-data/valid/`;
const validFunction = readFileSync(`${validDir}valid-function-1.js`, 'utf-8');
const objectPattern = readFileSync(`${validDir}object-pattern.js`, 'utf-8');
const unaryExpression = readFileSync(`${validDir}unary-expression.js`, 'utf-8');

const invalidFunction1 = readFileSync(`${__dirname}/test-data/invalid-function-1.js`, 'utf-8');
const invalidFunction2 = readFileSync(`${__dirname}/test-data/invalid-function-2.js`, 'utf-8');

tester.run('no-declaration-before-return', rule, {
    valid: [
        { code: validFunction },
        { code: objectPattern },
        { code: unaryExpression },
    ],
    invalid: [
        // { code: invalidFunction1, errors: [{ messageId: 'noDeclarationBeforeReturn' }] },
        // { code: invalidFunction2, errors: [{ messageId: 'noDeclarationBeforeReturn' }] },
    ]
});