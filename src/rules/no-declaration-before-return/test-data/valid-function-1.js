const data = {
    nOrderOrigLocaID: {
        persist: false,
        validator: { opt: 1, pgid: 1, fkey: Const.relType.mdLoca },
        getter() {
            // if cancelled, then fallback to 'real' MO orig/dest loca id
            if (this._order.isSalesOrder) { return this.curr.nOrigLocaID; }
            const collMile = this.curr._collMile;
            // if cancelled, then MO *might* be missing its collect milestone
            if (this.curr.dtCancelled) { return collMile?.curr.nLocaID || this.curr.nOrigLocaID; }
            // if NOT cancelled, then MO *must* have its collect milestone
            // throw E.generic "MO:#{@getID()} nOrderOrigLocaID: should not be possible" unless collMile
            // return collMile.curr.nLocaID
            if (this._order.rec.curr._isOceanOrder && !collMile) {
                const portOfLoadingLoca = this._order.rec.curr._portOfLoadingLocaIDs[0];
                if (portOfLoadingLoca) { return portOfLoadingLoca; }
            }
            return collMile?.curr.nLocaID || this.curr.nOrigLocaID;
        },
    },
}