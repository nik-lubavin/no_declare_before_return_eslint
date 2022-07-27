import { Rule } from "eslint";
import { Node, BlockStatement, Expression, ExpressionStatement, FunctionDeclaration, Identifier, IfStatement, LogicalExpression, ReturnStatement, Statement, SwitchStatement, VariableDeclaration, FunctionExpression, ChainExpression, MemberExpression, UnaryExpression } from "estree";
import { parse_VariableDeclaration } from "./parser/declarations";
import { parse_AnyExpression } from "./parser/expressions";
import { parse_FunctionDeclaration, parse_FunctionExpression } from "./parser/functions";
import { parse_BlockStatement } from "./parser/statements";

export const DEBUG_LOGGING = 0;

export interface LintData { return: boolean, variables: Record<string, Node> };


const rule: Rule.RuleModule = {
    meta: {
        messages: {
            noDeclarationBeforeReturn: 'Do not declare variables before Return',
        },
        fixable: 'code'
    },
    create: context => ({
        FunctionDeclaration: node => {
            parse_FunctionDeclaration(node, context);
        },
        FunctionExpression: node => {
            parse_FunctionExpression(node, context);
        },
    })
}

// ==== OTHER =====

export function checkReturn(declaredVariables: LintData, context: Rule.RuleContext, node: Node): boolean {
    const entries = Object.entries(declaredVariables.variables);
    if (declaredVariables.return && entries.length) {
        const entry = entries[0];
        const error = entry[0];
        const node = entry[1];
        if (DEBUG_LOGGING) {
            console.log(
                `throw an error: ${node.loc?.start.line} (${node.loc?.start.column}) - ${node.loc?.end.line} (${node.loc?.end.column})`,
                { declaredVariables, error, range: node.range });
        }

        context.report({
            messageId: 'noDeclarationBeforeReturn', node
        })

        return true;
    }

    declaredVariables.return = false;
    return false
}



export default rule;