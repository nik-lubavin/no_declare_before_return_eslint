import { Rule } from "eslint";
import { BlockStatement, ExpressionStatement, IfStatement, ReturnStatement } from "estree";
import { checkReturn, LintData } from "../no-declaration-before-return";
import { parse_VariableDeclaration } from "./declarations";
import { parse_AnyExpression } from "./expressions";
import { parse_Identifier } from "./identifiers";

// ==== STATEMENTS ====
export function parse_BlockStatement(node: BlockStatement, declaredVariables: LintData, context: Rule.RuleContext): void {
    for (const element of node.body) {

        let parsingGoesOn = true;

        switch (element.type) {
            case "VariableDeclaration":
                parse_VariableDeclaration(element, declaredVariables);
                break;
            case "ExpressionStatement":
                parse_ExpressionStatement(element, declaredVariables);
                break;
            case "IfStatement":
                parse_IfStatement(element, declaredVariables, context);

                if (checkReturn(declaredVariables, context, element)) {
                    parsingGoesOn = false;
                }
                break;
            case "ReturnStatement":

                parse_ReturnStatement(element, declaredVariables);
                break;
        }

        if (!parsingGoesOn) break;

    }
}

function parse_ExpressionStatement(node: ExpressionStatement, declaredVariables: LintData) {
    parse_AnyExpression(node.expression, declaredVariables);
}

function parse_ReturnStatement(node: ReturnStatement, declaredVariables: LintData) {
    if (node.argument) {
        switch (node.argument?.type) {
            case 'Identifier':
                parse_Identifier(node.argument, declaredVariables);
                break;
            default:
                // Parsing all expressions in one function
                parse_AnyExpression(node.argument, declaredVariables);
        }
    }

    declaredVariables.return = true;
}

function parse_IfStatement(node: IfStatement, declaredVariables: LintData, context: Rule.RuleContext): void {
    // parsing test section
    parse_AnyExpression(node.test, declaredVariables);

    // parsing consequent
    const consequent = node.consequent;
    if (consequent.type === 'BlockStatement') {
        parse_BlockStatement(consequent, declaredVariables, context);
    } else if (consequent.type === 'ExpressionStatement') {
        // expression
        parse_AnyExpression(consequent.expression, declaredVariables);
    }

    // going into a recurse, parsing "else if" clauses
    const alternate = node.alternate;
    if (alternate) {
        if (alternate.type === 'IfStatement') {
            parse_IfStatement(alternate, declaredVariables, context);
        } else if (alternate.type === 'ExpressionStatement') {
            parse_AnyExpression(alternate.expression, declaredVariables);
        }
    }
}