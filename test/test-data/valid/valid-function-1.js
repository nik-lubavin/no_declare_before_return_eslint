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
    aLinkedCarrIDs: {
        persist: false,
        validator: { opt: 1, arr: 1, vals: { int: 1 } },
        getter() {
          // MO is not considered to have any TOs when cancelled/deleted
          if (this.curr._isUnlinked) { return undefined; }
          const transOrders = this.curr._nonCancelledTransOrders;
          if (!transOrders?.length) { return undefined; }
          return _.sortBy(_.uniq(_.compactMap(transOrders, 'nCarrID')));
        },
      },
      aLinkedCourID: {
        persist: false,
        validator: { opt: 1, arr: 1, vals: { int: 1 } },
        getter() {
          // MO is not considered to have any TOs when cancelled/deleted
          if (this.curr._isUnlinked) { return undefined; }
          const transOrders = this.curr._nonCancelledTransOrders;
          if (!transOrders?.length) { return undefined; }
          return _.sortBy(_.uniq(_.compactMap(transOrders, 'nDefaultCourierID')));
        },
      },
      _transOrders() {
        const {
          aTransOrderID,
        } = this.curr;
        if (!aTransOrderID?.length) { return []; }
        return libNextCache.getByIDs(Const.relType.ctTransOrder, aTransOrderID);
      },
      _transOrderCodesString() {
        const codes = this.curr._transOrderCodes;
        if (!codes.length) { return null; }
        return _.join(codes, ',');
      },
      _hasAllWasteDocuments() {
        if (!this.curr._finalWaste) { return true; }

        const fixedDocumentTypeIDsWaste = _.map(
          Const.wasteDocumentType,
          (wasteDocumentType) => clsMdDocumentType.getFixedID(
            this.curr.nDivID,
            Const.fixedDocumentType[wasteDocumentType],
          ),
        );
        if (!fixedDocumentTypeIDsWaste.length) { return false; }

        const moWasteFiles = _.filter(
          this.curr._allRelFiles,
          (r) => r.nDocuID && _.includes(fixedDocumentTypeIDsWaste, r.nDocuID),
        );

        return moWasteFiles.length === fixedDocumentTypeIDsWaste.length;
      },
}