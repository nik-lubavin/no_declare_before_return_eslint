const data = {
    diff(rawO1, rawO2, opts) {
        for (const k of keys) {
            let _diff;
            const v1 = o1[k];
            const v2 = o2[k];

            switch (t1) {
                case typeArray:
                case typeObject:
                    if (_.isEqual(v1, v2)) {
                        continue;
                    }

                    isDifferent = true;

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

                    continue;

                default:
                    // types are same ; values are different

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

