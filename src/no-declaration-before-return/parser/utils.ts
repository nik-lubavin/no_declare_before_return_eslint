export function extraLogging(flag: boolean, node: any) {
    if (flag) {
        console.log('parsing ', { type: node.type, startLine: node.loc.start.line, endLine: node.loc.end.line })
    }
}