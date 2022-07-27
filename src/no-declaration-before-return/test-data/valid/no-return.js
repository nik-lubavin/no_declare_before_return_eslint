const data = {

    validateConsistency() {
        if (Config.env !== 'dev') { return; }

        const { nMatOrderID: id } = this.curr;

        const moStatus = this.curr.sMatOrderStatus;
        const cancelled = this.curr.dtCancelled;
        const completed = this.curr.dtCompleted;
        const denorms = this.curr.jDenorms;

        this.validateRequiredDenorms();

        if (_.isSet(this.curr.nCancelReasonID) && !_.isSet(this.curr.dtCancelled)) {
            throw E.model('cancel reason may only be set on a cancelled order');
        }

        if (this.curr.dtDelete) {
            // if order was deleted, then all denorms related to SO/TO should have been cleared
            for (const key of Object.keys(denorms || {})) {
                const needle = key.substring(1, 6);
                const val = denorms[key];
                if (['Sales', 'Trans'].includes(needle) && _.isSet(val)) {
                    throw E.model(`deleted material order should no longer be linked to any SO/TO, and therefore denorm field '${key}' should be null`);
                }
            }
        }

        // If something indicates completed, but not both, it's an error
        if (completed && !_.includes(moStatus, 'COMPLETED') && !_.includes(moStatus, 'CANCEL')) {
            throw E.model(`MO ${id} dtCompleted ${completed} / Status mismatch ${moStatus}`);
        }

        // If something indicates cancellation, but not both, it's an error
        if (cancelled && !_.includes(moStatus, 'CANCEL')) {
            throw E.model(`MO ${id} dtCancelled ${cancelled} / Status mismatch ${moStatus}`);
        }
    }
}
