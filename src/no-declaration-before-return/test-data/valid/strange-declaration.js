const data = {

  getter() {
    const carrierStatusOrderedByPrio = [
      Const.sCarrierStatus.DELAY,
      Const.sCarrierStatus.NOT_DELIVERED,
      Const.sCarrierStatus.DELIVERY_REFUSED,
    ];

    console.log()

    // figure out highest prio sCarrierStatusStandardised among packageIdentifierRows
    const piStatus = _.maxBy(
      this._cache?.packageIdentifierRows || [],
      (pi) => carrierStatusOrderedByPrio.indexOf(pi.sCarrierStatusStandardised),
    )?.sCarrierStatusStandardised || null;

    const checkStatuses = _.compact([this.curr.sCarrierStatusStandardised, piStatus]);
    if (_.isEmpty(checkStatuses)) { return null; }

    // if any status matches a mapped status, return it
    for (const carrierStatus of (_.reverse(carrierStatusOrderedByPrio) || [])) { // reverse because: more index = more prio
      if ((checkStatuses || []).includes(carrierStatus)) {
        return mapCarrierStatusToDeliveryDeviation[carrierStatus];
      }
    }

    return null;
  },
}

