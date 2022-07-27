const data = {
    activate(transOrder, options) {
     // FALSE-POSITIVE
     const opts = _.pickDefaults(options, {
       lockingValidation: null,
       carrID: null,
     });
 
     if (_.isInteger(transOrder)) {
       let to = libNewTransOrder.factoryID(transOrder);
       if (!to.rec.curr.nCarrID) to.assignCarrier(opts.carrID);
       to.commit();
 
       to = libNewTransOrder.factoryID(transOrder);
       to.activateMaybeManual();
       to.commit();
       return undefined;
     }
 
     return libApiCall.external.local('ct/newTransOrder/activateMaybeManual', {
       transOrderID: transOrder.transOrderID,
       wasManuallyConfirmed: true,
       lockingValidation: opts.lockingValidation,
     });
   },
 }
 