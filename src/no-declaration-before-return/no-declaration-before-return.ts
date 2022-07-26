import { Rule } from "eslint";
import { Node, BlockStatement, Expression, ExpressionStatement, FunctionDeclaration, Identifier, IfStatement, LogicalExpression, ReturnStatement, Statement, SwitchStatement, VariableDeclaration, FunctionExpression, ChainExpression, MemberExpression, UnaryExpression } from "estree";
import { parse_VariableDeclaration } from "./parser/declarations";
import { parse_AnyExpression } from "./parser/expressions";

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

// FUNCTIONS

function parse_FunctionDeclaration(node: FunctionDeclaration, context: Rule.RuleContext) {
    const declaredVariables: LintData = { return: false, variables: {} };

    parse_BlockStatement(node.body, declaredVariables, context);
}

function parse_FunctionExpression(node: FunctionExpression, context: Rule.RuleContext) {
    const declaredVariables: LintData = { return: false, variables: {} };

    parse_BlockStatement(node.body, declaredVariables, context);
}

// ==== STATEMENTS ====
function parse_BlockStatement(node: BlockStatement, declaredVariables: LintData, context: Rule.RuleContext): void {
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

    // parsing body
    if (node.consequent.type === 'BlockStatement') {
        parse_BlockStatement(node.consequent, declaredVariables, context);
    }

    // going into a recurse, parsing "else if" clauses
    if (node.alternate && node.alternate.type === "IfStatement") {
        parse_IfStatement(node.alternate, declaredVariables, context);
    }
}

// ==== IDENTIFIERS =====

export function parse_Identifier(node: Identifier, declaredVariables: LintData): void {
    if (declaredVariables.variables[node.name]) {
        delete declaredVariables.variables[node.name];
        if (DEBUG_LOGGING) {
            console.log('removed:', node.name,);
        }

    }

}

export function parse_ArrayOfIdentifiers(identifiers: Identifier[], declaredVariables: LintData): void {
    identifiers.forEach(identifier => parse_Identifier(identifier, declaredVariables));
}

export function identifierFilter(arr: any[] | any[][]): Identifier[] {
    return arr.flat().filter(item => !!item).filter(item => item.type === 'Identifier');
}

// ==== OTHER =====

function checkReturn(declaredVariables: LintData, context: Rule.RuleContext, node: Node): boolean {
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

    return false
}



export default rule;