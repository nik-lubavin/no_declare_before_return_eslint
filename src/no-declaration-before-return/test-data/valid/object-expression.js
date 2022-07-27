const data = {
    _lastMobile() {
        if ((this.curr.nCarrID === null) || !this.curr.bActive) {
            return 'ANTE';
        }

        const now = Ldt.nowISO();
        const gpsTracking = this.curr.oSettings?.mdCarr?.jSettings?.sGpsTracking;

        if (this.curr.dtCancelled || this.curr.dtReadyReporting || (this.curr.dtFinished < now)) {
            if (!this.curr.jLastPosi?.dt) {
                if (gpsTracking === Const.ctGpsExpected.NEVER) {
                    return 'POST_NOT_EXPECTED';
                }
                return 'POST_WITHOUT';
            }
            return 'POST_WITH';
        }

        // FALSE-POSITIVE
        const gpsFrequency = this.curr.oSettings?.mdCarr?.jSettings?.nGpsFrequency || 15;

        if (this.curr.jLastPosi?.dt
            && (this.curr.jLastPosi.dt >= Ldt.now().plus({ minutes: gpsFrequency }).toISO())) {
            return 'LIVE';
        }
    }
}
