const data = {
    aLinkedCarrIDs: {
        persist: false,
        validator: { opt: 1, arr: 1, vals: { int: 1 } },
        getter() {
            const transOrders = this.curr._nonCancelledTransOrders;
            // MO is not considered to have any TOs when cancelled/deleted
            if (this.curr._isUnlinked) { return undefined; }
            if (!transOrders.length) { return undefined; }
            return _.sortBy(_.uniq(_.compactMap(transOrders, 'nCarrID')));
        },
    },
};
