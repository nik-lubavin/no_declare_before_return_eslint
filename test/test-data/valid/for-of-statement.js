const data = {
    diff(rawO1, rawO2, opts) {
        // FALSE-POSITIVE
        const result = {};
        let isDifferent = false;
        let k;

        let keys = _.uniq(_.concat(_.keys(o1), _.keys(o2)));
        if (!isArray) {
            keys = _.sortBy(keys);
        }

        for (k of keys) {
            if (t1 !== t2) {
                // types are different

                if (opts.ignoreNullVsUndefined) {
                    const t1ContainsNullUndef = [typeNull, typeUndefined].includes(t1);
                    // ignore the case when one value is null and the other is undefined
                    if (t1ContainsNullUndef && [typeNull, typeUndefined].includes(t2)) {
                        continue;
                    }
                }

                isDifferent = true;

                if (opts.keepRight) {
                    result[k] = v2;
                } else {
                    result[k] = { l: v1, r: v2 };
                }

                continue;
            }
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

