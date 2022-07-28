const data = {
    _transOrderCodesString() {
       const codes = this.curr._transOrderCodes;
       if (!codes.length) { return null; }
       return _.join(codes, ',');
     },
}
