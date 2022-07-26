const data = {
    _destStopSeq() {
       const moDestLocaID = this.curr.nnn;
       const origStopSeq = this.curr.orig;

       const stops = origStopSeq >= 0
         ? this._order.getStops().slice(origStopSeq)
         : this._order.getStops();
       const idx = _.indexOf(
         this._order.getStops(),
         _.find(stops, (stop) => stop.curr.nLocaID === moDestLocaID),
       );

       if ((idx === -1) && this.curr.dtCancelled) { return this._order.getStops().length - 1; }
       return idx;
     },
}
