const data = {
    _allAssetsAllocated() {
       const matLines = this.curr._matLines;
       if (matLines.length === 0) { return undefined; }
       return _.every(_.map(matLines, (line) => line.curr.bAllAssetsAllocated !== false));
     },
}
