const data = {
    validateConsistency() {
        const { nMatOrderID: id } = this.curr;

        if (cancelled && !_.includes(moStatus, 'CANCEL')) {
            return E.model(`MO ${id} dtCancelled ${cancelled} / Status mismatch ${moStatus}`);
        }
    }
}