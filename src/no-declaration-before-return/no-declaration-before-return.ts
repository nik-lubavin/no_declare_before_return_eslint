import { Rule } from "eslint";
import { Node, BlockStatement, Expression, ExpressionStatement, FunctionDeclaration, Identifier, IfStatement, LogicalExpression, ReturnStatement, Statement, SwitchStatement, VariableDeclaration, FunctionExpression, ChainExpression, MemberExpression, UnaryExpression } from "estree";

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

// ==== EXPRESSIONS ====

function parse_AnyExpression(node: Expression, declaredVariables: LintData) {
    if (node.type === "LogicalExpression") {
        // at first extract all the non-logical Expressions with identifiers
        const nonLogicalExpressions: any = [];
        _finalize_LogicalExpression(node, nonLogicalExpressions);

        nonLogicalExpressions.forEach((expression: any) => {
            _parse_NonLogicalExpression(expression, declaredVariables);
        });
    } else {
        _parse_NonLogicalExpression(node, declaredVariables);
    }

}

function _parse_NonLogicalExpression(node: Expression, declaredVariables: LintData): void {
    if (node.type === 'UnaryExpression') {
        _finalize_UnaryExpression(node, declaredVariables);
    } else if (node.type === 'ChainExpression') {
        _finalize_ChainExpression(node, declaredVariables);

    } else if (node.type === 'MemberExpression') {
        _finalize_MemberExpression(node, declaredVariables);
    } else if (node.type === 'BinaryExpression') {
        parse_AnyExpression(node.left, declaredVariables);
        parse_AnyExpression(node.right, declaredVariables);

    } else {
        // Just looking for identifiers everywhere
        const candidates: IdentifierCandidates = [
            (node as any).left, (node as any).right, // assignment expression
            (node as any).callee, (node as any).arguments, // call expression
            (node as any).argument, // update expression
        ];

        const identifiers = _identifierFilter(candidates);

        parse_ArrayOfIdentifiers(identifiers, declaredVariables);
    }
}

function _finalize_UnaryExpression(node: UnaryExpression, declaredVariables: LintData) {
    if (node.argument.type === 'Identifier') {
        parse_Identifier(node.argument, declaredVariables);
    } else {
        parse_AnyExpression(node.argument, declaredVariables);
    }

}

function _finalize_ChainExpression(node: ChainExpression, declaredVariables: LintData) {
    if (node.expression.type === 'MemberExpression') {
        _finalize_MemberExpression(node.expression, declaredVariables);
    } else {
        console.error('Error 1, Unknown expression type');

    }
}

function _finalize_MemberExpression(node: MemberExpression, declaredVariables: LintData): void {
    const identifier = _getIdentifier_MemberExpression(node);
    if (identifier) parse_Identifier(identifier, declaredVariables);
}

function _getIdentifier_MemberExpression(node: MemberExpression): Identifier | null {
    // getting only the object in type Identifier
    if (node.object.type === 'MemberExpression') {
        return _getIdentifier_MemberExpression(node.object);
    } else if (node.object.type === 'Identifier') {
        return node.object;
    } else {
        return null;
    }
}

function _finalize_LogicalExpression(node: LogicalExpression, result: any[]): any[] {
    if (node.left.type === 'LogicalExpression') {
        // going recursive
        _finalize_LogicalExpression(node.left, result)
    } else {
        result.push(node.left)
    }

    // right side can not be a logical expression
    result.push(node.right);

    return result;
}

// ===== DECALRATIONS =====

function parse_VariableDeclarator(node: VariableDeclaration, declaredVariables: LintData): void {
    const declId = node.declarations[0].id;
    if (declId.type === 'Identifier') {
        _declareIdentifier(declId, declaredVariables)
    } else if (declId.type === 'ObjectPattern') {
        declId.properties.forEach(item => {
            if (item.type === 'Property') {
                if (item.key.type === 'Identifier') {
                    _declareIdentifier(item.key, declaredVariables)
                } else {
                    console.error('Error 3, unexpected type');
                }
            } else {
                console.error('Error 4, unexpected type');
            }
        })
    }

}

function _declareIdentifier(node: Identifier, declaredVariables: LintData) {
    const name = node.name;
    if (!declaredVariables.variables[name]) {
        declaredVariables.variables[name] = node;
        if (DEBUG_LOGGING) {
            console.log(`Added variable ${name} (${node.loc?.start.line} - ${node.loc?.end.line})`);
        }
    }
}

// ==== IDENTIFIERS =====

function parse_Identifier(node: Identifier, declaredVariables: LintData): void {
    if (declaredVariables.variables[node.name]) {
        delete declaredVariables.variables[node.name];
        if (DEBUG_LOGGING) {
            console.log('removed:', node.name,
                `${node.loc?.start?.column} -> ${node.loc?.end?.column}`);
        }

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