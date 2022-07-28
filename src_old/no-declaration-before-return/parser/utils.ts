export function extraLogging(flag: boolean, node: any) {
    let special = false
    // if (node.loc?.start.line === 11) {
    //     special = true;
    // }

    if (flag || special) {
        console.log('parsing ', { type: node.type, startLine: node.loc.start.line, endLine: node.loc.start.line })
    }
}