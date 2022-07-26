// ==== EXPRESSIONS ====

import { ChainExpression, Expression, Identifier, LogicalExpression, MemberExpression, UnaryExpression } from "estree";
import { identifierFilter, LintData, parse_ArrayOfIdentifiers, parse_Identifier } from "../no-declaration-before-return";
import { extraLogging } from "./utils";

export type IdentifierCandidates = any[];

export function parse_AnyExpression(node: Expression, declaredVariables: LintData, doExtraLogging = false) {
    if (node.type === "LogicalExpression") {
        extraLogging(doExtraLogging, node);

        // at first extract all the non-logical Expressions with identifiers
        const nonLogicalExpressions: any = [];
        _parse_LogicalExpression(node, nonLogicalExpressions, doExtraLogging);


        nonLogicalExpressions.forEach((expression: any) => {
            _parse_NonLogicalExpression(expression, declaredVariables, doExtraLogging);
        });
    } else {
        _parse_NonLogicalExpression(node, declaredVariables, doExtraLogging);
    }

}

function _parse_NonLogicalExpression(node: Expression, declaredVariables: LintData, doExtraLogging = false): void {
    if (node.type === 'UnaryExpression') {
        extraLogging(doExtraLogging, node);

        _finalize_UnaryExpression(node, declaredVariables);
    } else if (node.type === 'ChainExpression') {
        extraLogging(doExtraLogging, node);
        // _finalize_ChainExpression(node, declaredVariables);

        parse_AnyExpression(node.expression, declaredVariables, doExtraLogging)

    } else if (node.type === 'MemberExpression') {
        extraLogging(doExtraLogging, node);

        // parsing before .
        parse_AnyExpression(node.object as Expression, declaredVariables, doExtraLogging);

    } else if (node.type === 'BinaryExpression') {
        extraLogging(doExtraLogging, node);

        parse_AnyExpression(node.left, declaredVariables, doExtraLogging);
        parse_AnyExpression(node.right, declaredVariables, doExtraLogging);

    } else if (node.type === 'CallExpression') {
        extraLogging(doExtraLogging, node);

        parse_AnyExpression(node.callee as Expression, declaredVariables, doExtraLogging);
        node.arguments.forEach((arg) => {

            parse_AnyExpression(arg as Expression, declaredVariables, doExtraLogging);
        })
    } else if (node.type === 'ArrowFunctionExpression') {
        extraLogging(doExtraLogging, node);
        if (node.body.type === 'BlockStatement') {
            // Have not met still
            console.error('Unimplemented');
        } else {
            // is Expression
            parse_AnyExpression(node.body as Expression, declaredVariables, doExtraLogging);
        }
    } else if (node.type === 'ConditionalExpression') {
        extraLogging(doExtraLogging, node);

        parse_AnyExpression(node.test as Expression, declaredVariables, doExtraLogging);
        parse_AnyExpression(node.consequent as Expression, declaredVariables, doExtraLogging);
        parse_AnyExpression(node.alternate as Expression, declaredVariables, doExtraLogging);

    } else if (node.type === 'ArrayExpression') {
        extraLogging(doExtraLogging, node);

        node.elements.forEach(elementExpression =>
            parse_AnyExpression(elementExpression as Expression, declaredVariables, doExtraLogging))

    } else if (node.type === 'TemplateLiteral') {
        extraLogging(doExtraLogging, node);

        node.expressions.forEach(elementExpression =>
            parse_AnyExpression(elementExpression as Expression, declaredVariables, doExtraLogging))

    } else {
        // Older code, I'm not sure if it is needed
        extraLogging(doExtraLogging, node);
        // Just looking for identifiers everywhere
        const candidates: IdentifierCandidates = [
            (node as any), // is Identifier
            (node as any).left, (node as any).right, // assignment expression
            (node as any).callee, (node as any).arguments, // call expression
            (node as any).argument, // update expression
        ];

        const identifiers = identifierFilter(candidates);

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

// function _finalize_ChainExpression(node: ChainExpression, declaredVariables: LintData) {
//     if (node.expression.type === 'MemberExpression') {
//         _finalize_MemberExpression(node.expression, declaredVariables);
//     } else {
//         console.error('Error 1, Unknown expression type');

//     }
// }

// function _finalize_MemberExpression(node: MemberExpression, declaredVariables: LintData): void {
//     const identifier = _getIdentifier_MemberExpression(node);
//     if (identifier) parse_Identifier(identifier, declaredVariables);
// }

// function _getIdentifier_MemberExpression(node: MemberExpression): Identifier | null {
//     // getting only the object in type Identifier
//     if (node.object.type === 'MemberExpression') {
//         return _getIdentifier_MemberExpression(node.object);
//     } else if (node.object.type === 'Identifier') {
//         return node.object;
//     } else {
//         return null;
//     }
// }

function _parse_LogicalExpression(node: LogicalExpression, result: any[], doExtraLogging = false): any[] {
    if (node.left.type === 'LogicalExpression') {
        // going recursive
        _parse_LogicalExpression(node.left, result)
    } else {
        result.push(node.left)
    }

    // right side can not be a logical expression
    result.push(node.right);

    return result;
}

