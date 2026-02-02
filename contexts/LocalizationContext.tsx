import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Define translations structure
type Translations = {
  [key: string]: string | Translations;
};

interface LocalizationContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, vars?: { [key: string]: string | number }) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

const getTranslation = (translations: { [key: string]: Translations }, key: string, locale: string, vars?: { [key: string]: string | number }): string => {
    const langTranslations = translations[locale];
    if (!langTranslations) return key;

    let text = key.split('.').reduce((obj: any, k: string) => {
        return obj && obj[k] !== undefined ? obj[k] : key;
    }, langTranslations) as string;

    if (vars && typeof text === 'string') {
        Object.keys(vars).forEach(varKey => {
            const regex = new RegExp(`{{${varKey}}}`, 'g');
            text = text.replace(regex, String(vars[varKey]));
        });
    }

    return text;
};


export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [locale, setLocaleState] = useState(() => {
        const savedLocale = localStorage.getItem('locale');
        return savedLocale && ['en', 'ar'].includes(savedLocale) ? savedLocale : 'ar';
    });
    
    const [translations, setTranslations] = useState<{ [key: string]: Translations }>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTranslations = async () => {
            setIsLoading(true);
            try {
                // The path should be relative to the index.html file
                const [arRes, enRes] = await Promise.all([
                    fetch('./locales/ar.json'),
                    fetch('./locales/en.json')
                ]);
                if (!arRes.ok || !enRes.ok) {
                   throw new Error('Failed to fetch translation files');
                }
                const ar = await arRes.json();
                const en = await enRes.json();
                setTranslations({ ar, en });
            } catch (error) {
                console.error("Could not load translations:", error);
                // Set empty to avoid breaking the app, it will fallback to keys
                setTranslations({ ar: {}, en: {} });
            } finally {
                setIsLoading(false);
            }
        };

        fetchTranslations();
    }, []);

    const setLocale = (newLocale: string) => {
        if (['en', 'ar'].includes(newLocale)) {
            localStorage.setItem('locale', newLocale);
            setLocaleState(newLocale);
        }
    };

    useEffect(() => {
        document.documentElement.lang = locale;
        document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    }, [locale]);

    const t = (key: string, vars?: { [key:string]: string | number }) => getTranslation(translations, key, locale, vars);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    return (
        <LocalizationContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LocalizationContext.Provider>
    );
};

export const useLocalization = () => {
    const context = useContext(LocalizationContext);
    if (context === undefined) {
        throw new Error('useLocalization must be used within a LocalizationProvider');
    }
    return context;
};
