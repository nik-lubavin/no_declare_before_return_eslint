import { Rule } from "eslint";
import { FunctionDeclaration, FunctionExpression } from "estree";
import { LintData } from "../no-declaration-before-return";
import { parse_BlockStatement } from "./statements";

// FUNCTIONS
export function parse_FunctionDeclaration(node: FunctionDeclaration, context: Rule.RuleContext) {
    const declaredVariables: LintData = { return: false, variables: {} };

    parse_BlockStatement(node.body, declaredVariables, context);
}

export function parse_FunctionExpression(node: FunctionExpression, context: Rule.RuleContext) {
    const declaredVariables: LintData = { return: false, variables: {} };

    parse_BlockStatement(node.body, declaredVariables, context);
}