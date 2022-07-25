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


const invalidFunction1 = readFileSync(`${__dirname}/test-data/invalid-function-1.js`, 'utf-8');
const invalidFunction2 = readFileSync(`${__dirname}/test-data/invalid-function-2.js`, 'utf-8');
const validFunction = readFileSync(`${__dirname}/test-data/valid-function-1.js`, 'utf-8');

tester.run('no-declaration-before-return', rule, {
    valid: [
        // { code: "const a = require('package') " },
        { code: validFunction }
    ],
    invalid: [
        // { code: invalidFunction1, errors: [{ messageId: 'noDeclarationBeforeReturn' }] },
        // { code: invalidFunction2, errors: [{ messageId: 'noDeclarationBeforeReturn' }] },
    ]
});