const data = {
    _transOrders() {
        const {
            aTransOrderID,
        } = this.curr;
        if (!aTransOrderID?.length) { return []; }
        return libNextCache.getByIDs(Const.relType.ctTransOrder, aTransOrderID);
    },
}
