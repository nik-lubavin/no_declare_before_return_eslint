const data = {
    throw(code, rawLang) {
        if (!_trx) {
            _trx = loadTranslationFileFromDisk();
        }

        const settings = _trx;
        let lang = rawLang;
        if (_.isUndefined(settings[lang])) {
            lang = Const.defaultLanguage;
        }

        // Take custom translation
        if (settings[lang]?.THEMES[Config.theme] && _.isSet(settings[lang]?.THEMES[Config.theme][code])) {
            return settings[lang].THEMES[Config.theme][code];
        }

        // Use regular translation
        if (_.isSet(settings[lang][code])) {
            return settings[lang][code];
        }

        let warningMsg;
        if (lang === 'en') {
            if (Config.env === 'dev') {
                // FALSE-POSITIVE
                const errorMsg = `trx failed: ${lang} ${code} ${new Error().stack}`;
                throw E.system(errorMsg);
            }

            warningMsg = `trx missing for: ${lang} ${code} ${new Error().stack}`;
            log.warn(warningMsg, { source_stack: new Error().stack });

            const splitCode = code.split('.');
            return splitCode[splitCode.length - 1]
                .substring(1)
                .replace(/(ID|[A-Z][a-z])/g, ' $1')
                .trim();
        }
    }
}