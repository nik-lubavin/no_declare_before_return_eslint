const data = {
    _origStopSeq() {
        const moOrigLocaID = this.curr.nOrderOrigLocaID;
        const idx = _.indexOf(
            this._order.getStops(),
            _.find(this._order.getStops(), (stop) => stop.curr.nLocaID === moOrigLocaID),
        );
        if ((idx === -1) && this.curr.dtCancelled) { return 0; }

        if ((idx > -1) && (this._order.getStops()[idx].get('sStopType') === Const.hh) && this._order.ooo()) { return 0; }
        return idx;
    },
}
