const data = {
    diff(rawO1, rawO2, opts) {
        // FALSE-POSITIVE
        const result = {};
        let isDifferent = false;
        const isNotDifferent = true;
        let k;

        let keys = _.uniq(_.concat(_.keys(o1), _.keys(o2)));
        if (!isArray) {
            keys = _.sortBy(keys);
        }

        const typeArray = 1;

        switch (t1()) {
            case typeArray:
            case typeObject:
                if (_.isEqual(v1, v2)) {
                    v1 = v2
                }

                isDifferent = isNotDifferent;

                if (opts.keepRight) {
                    result[k] = v2;
                } else if (opts.shallow) {
                    result[k] = { l: v1, r: v2 };
                } else {
                    _diff = self.diff(v1, v2, {
                        ignoreNullVsUndefined: opts.ignoreNullVsUndefined,
                        keepRight: false,
                        shallow: false,
                        name: k,
                    });
                    if (_diff !== undefined) {
                        result[k] = _diff;
                    }
                }

                v1 = v2

            default:
                // types are same ; values are different

                isDifferent = true;

                if (opts.keepRight) {
                    result[k] = v2;
                } else {
                    result[k] = { l: v1, r: v2 };
                }

                v1 = v2
        }

        if (!isDifferent) {
            return undefined;
        }

        // return result if it has *any* keys
        if (Object.keys(result).length) {
            return result;
        }

        return undefined;
    },
}