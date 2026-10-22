export const lang = (() => {
    const countryMapping: Readonly<Record<string, string>> = {
        id: 'ID',
        en: 'US',
        fr: 'FR',
        de: 'DE',
        es: 'ES',
        zh: 'CN',
        ja: 'JP',
        ko: 'KR',
        ar: 'SA',
        ru: 'RU',
        it: 'IT',
        nl: 'NL',
        pt: 'PT',
        tr: 'TR',
        th: 'TH',
        vi: 'VN',
        ms: 'MY',
        hi: 'IN',
    };

    let country: string | null = null;
    let locale: string | null = null;
    let language: string | null = null;
    let mapping: Map<string, string> | null = null;

    return {
        on(l: string, val: string) {
            if (!mapping) {
                mapping = new Map();
            }
            mapping.set(l, val);
            return this;
        },
        get(): string | undefined {
            if (!mapping) {
                return undefined;
            }
            const tmp = mapping.get(language ?? 'en');
            mapping.clear();
            return tmp;
        },
        getCountry(): string | null {
            return country;
        },
        getLocale(): string | null {
            return locale;
        },
        getLanguage(): string | null {
            return language;
        },
        setDefault(l: string): void {
            let isFound = true;
            if (!countryMapping[l]) {
                isFound = false;
                console.warn('Language not found, please add manually in countryMapping');
            }

            country = isFound ? countryMapping[l] : 'US';
            language = isFound ? l : 'en';
            locale = `${language}_${country}`;
        },
        init(): void {
            mapping = new Map();
            const navLang = navigator.language.split('-').shift() ?? 'en';
            this.setDefault(navLang);
        },
    };
})();
