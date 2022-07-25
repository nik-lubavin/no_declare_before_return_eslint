import { RuleTester } from "eslint";
import { readFileSync } from "fs";
import rule from './no-declaration-before-return';

const tester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2015
    }
});

const validCode =
    `const {smth} = require('package')

function valid() {
  	const a = func()
    return a
}`;


const invalidFunction1 = readFileSync(`${__dirname}/test-data/invalid-function-1.js`, 'utf-8');

tester.run('no-declaration-before-return', rule, {
    valid: [
        { code: "const a = require('package') " }
    ],
    invalid: [
        { code: invalidFunction1, errors: [{ message: 'test message' }] }
    ]
});