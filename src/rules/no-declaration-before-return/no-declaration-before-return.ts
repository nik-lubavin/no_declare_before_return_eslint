import { Rule } from "eslint";
import { Node, BlockStatement, Expression, ExpressionStatement, FunctionDeclaration, Identifier, IfStatement, LogicalExpression, ReturnStatement, Statement, SwitchStatement, VariableDeclaration, FunctionExpression } from "estree";

const DEBUG_LOGGING = 1;

type LintData = { return: boolean, variables: Record<string, Node> };
type IdentifierCandidates = any[];

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

function parse_FunctionDeclaration(node: FunctionDeclaration, context: Rule.RuleContext) {
    if (DEBUG_LOGGING) {
        console.log('parse_FunctionDeclaration', { node });

    }
    const declaredVariables: LintData = { return: false, variables: {} };

    parse_BlockStatement(node.body, declaredVariables, context);
}

function parse_FunctionExpression(node: FunctionExpression, context: Rule.RuleContext) {
    if (DEBUG_LOGGING) {
        console.log('parse_FunctionExpression', { node });

    }
    const declaredVariables: LintData = { return: false, variables: {} };

    parse_BlockStatement(node.body, declaredVariables, context);
}

// ==== STATEMENTS ====
function parse_BlockStatement(node: BlockStatement, declaredVariables: LintData, context: Rule.RuleContext): void {
    for (const element of node.body) {

        let parsingGoesOn = true;

        switch (element.type) {
            case "VariableDeclaration":
                parse_VariableDeclarator(element, declaredVariables);
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

                console.log({ anc: context.getAncestors() });


                // if (checkReturn(declaredVariables, context, element)) {
                //     parsingGoesOn = false;
                // }
                break;
        }

        if (!parsingGoesOn) break;

    }
}

function parse_ExpressionStatement(node: ExpressionStatement, declaredVariables: LintData) {
    parse_Expression(node.expression, declaredVariables);
}

function parse_ReturnStatement(node: ReturnStatement, declaredVariables: LintData) {
    if (node.argument) {
        switch (node.argument?.type) {
            case 'Identifier':
                parse_Identifier(node.argument, declaredVariables);
                break;
            default:
                // Parsing all expressions in one function
                parse_Expression(node.argument, declaredVariables);
        }
    }

    declaredVariables.return = true;
}

function parse_IfStatement(node: IfStatement, declaredVariables: LintData, context: Rule.RuleContext): void {
    const test = node.test as any;
    let candidates: IdentifierCandidates[];

    // managing clause section
    if (test.type === "LogicalExpression") {
        // at first extract all the non-logical Expressions with identifiers
        const nonLogicalExpressions: any = [];
        parse_LogicalExpression(test, nonLogicalExpressions);

        nonLogicalExpressions.forEach((expression: any) => {
            parse_Expression(expression, declaredVariables);
        });
    } else {
        parse_Expression(test, declaredVariables);
    }

    // parsing body
    if (node.consequent.type === 'BlockStatement') {
        parse_BlockStatement(node.consequent, declaredVariables, context);
    }

    // going into a recurse, parsing "else if" clauses
    if (node.alternate && node.alternate.type === "IfStatement") {
        parse_IfStatement(node.alternate, declaredVariables, context);
    }
}

// ==== EXPRESSIONS ====

function parse_Expression(node: Expression, declaredVariables: LintData): void {
    const candidates: IdentifierCandidates = [
        (node as any).left, (node as any).right, // assignment expression
        (node as any).callee, (node as any).arguments, // call expression
        (node as any).argument, // update expression
    ];

    const identifiers = _identifierFilter(candidates);

    parse_ArrayOfIdentifiers(identifiers, declaredVariables);
}

function parse_LogicalExpression(node: LogicalExpression, result: any[]): any[] {
    if (node.left.type === 'LogicalExpression') {
        // going recursive
        parse_LogicalExpression(node.left, result)
    } else {
        result.push(node.left)
    }

    // right side can not be a logical expression
    result.push(node.right);

    return result;
}

// ===== DECALRATIONS =====

function parse_VariableDeclarator(node: VariableDeclaration, declaredVariables: LintData): void {
    const name = (node.declarations[0].id as Identifier).name;
    if (!declaredVariables.variables[name]) {
        declaredVariables.variables[name] = node;
    }
}

// ==== IDENTIFIERS =====

function parse_Identifier(node: Identifier, declaredVariables: LintData): void {
    if (declaredVariables.variables[node.name]) {
        delete declaredVariables.variables[node.name];
        // console.log('removed:', node.name,
        //     `${node.loc?.start?.column, node.loc?.start?.line} -> ${node.loc?.end?.column, node.loc?.end?.line}`);
    }

}

function parse_ArrayOfIdentifiers(identifiers: Identifier[], declaredVariables: LintData): void {
    identifiers.forEach(identifier => parse_Identifier(identifier, declaredVariables));
}

function _identifierFilter(arr: any[] | any[][]): Identifier[] {
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