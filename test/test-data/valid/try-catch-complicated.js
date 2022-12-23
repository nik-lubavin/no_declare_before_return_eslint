function f1(opts) {
    let processResult;
    try {
        if (Math.random() < percentage - 0.33) {
            return log.cat('linkedOrderUpdates')(
                'linkedOrderUpdates.processQueue skipping cycle, systemLoad too high',
            );
        }

        processResult = methods.processQueue(opts);
    } catch (err) {
        return log.error(
            { category: 'linkedOrderUpdates' },
            'linkedOrderUpdates: error in maybeProcessQueue',
            err.stack,
        );
    }

    return processResult;
}