// ===== DECLARATIONS =====

import { Identifier, VariableDeclaration } from "estree";
import { DEBUG_LOGGING, LintData } from "../no-declaration-before-return";
import { parse_AnyExpression } from "./expressions";

export function parse_VariableDeclaration(node: VariableDeclaration, declaredVariables: LintData, doExtraLogging = false): void {
    // parsing declaration part
    extraLogging(doExtraLogging, node)

    const declId = node.declarations[0].id;
    if (declId.type === 'Identifier') {
        _declareIdentifier(declId, declaredVariables)
    } else if (declId.type === 'ObjectPattern') {
        declId.properties.forEach(item => {
            if (item.type === 'Property') {
                const currNode = item.value;
                if (currNode.type === 'Identifier') {
                    _declareIdentifier(currNode, declaredVariables)
                } else {
                    console.error('Error 3, unexpected type');
                }
            } else {
                console.error('Error 4, unexpected type');
            }
        })
    } else {
        console.error('Error 7 Unsupported type');
    }

    // parsing init part
    const initExpression = node.declarations[0].init;
    if (initExpression) {
        parse_AnyExpression(initExpression, declaredVariables, doExtraLogging);
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