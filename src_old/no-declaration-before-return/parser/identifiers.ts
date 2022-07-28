// ==== IDENTIFIERS =====

import { Identifier } from "estree";
import { DEBUG_LOGGING, LintData } from "../no-declaration-before-return";

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