function translateCodes(filters) {
    const noDivFilters = [];
    filters.forEach((filter) => {
        // don't process filters that failed previous interface validation
        if (filter.err) {
            noDivFilters.push(filter);
            // try to translate Division Code
        } else if (filter.sDivCode && !filter.nDivID) {
            filter.nDivID = integrationHelpers.translateDivisionCodeToID(filter.sDivCode);
            if (options.relType === Const.relType.mdDiv && filter.nDivID) {
                filter.id = filter.nDivID;
            }
            if (!filter.nDivID) {
                filter.id = null;
                filter.err = 'Division not found';
                noDivFilters.push(filter);
            }
        }
        if (options.relType !== Const.relType.mdDiv) {
            delete filter.sDivCode;
        }
        filter.bDeleted = false;
    }); // should not be deleted

    // if translating division codes, job done
    if (options.relType === Const.relType.mdDiv) {
        return filters;
    }

    return allMatchedFilters.concat(noDivFilters, filters);
};