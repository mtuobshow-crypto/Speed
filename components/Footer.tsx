import React, { useState, useEffect, useRef, useContext } from 'react';
import { Globe, ChevronUp } from 'lucide-react';
import { Page } from '../types';
import { AppSettingsContext } from '../contexts/AppSettingsContext';
import { useLocalization } from '../contexts/LocalizationContext';

interface FooterProps {
    onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    const { settings } = useContext(AppSettingsContext);
    const { t, locale, setLocale } = useLocalization();
    const currentYear = new Date().getFullYear();

    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const langMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
                setIsLangMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (lang: string) => {
        setLocale(lang);
        setIsLangMenuOpen(false);
    };

    const linkClasses = "text-gray-400 hover:text-indigo-400 transition-colors";

    return (
        <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between text-center sm:text-right">
                <p className="text-sm text-gray-500 mb-4 sm:mb-0">
                    {t('footer.copyright', { year: currentYear, siteTitle: settings.siteTitle })}
                </p>
                <div className="flex items-center space-x-6 space-x-reverse text-sm">
                    <button onClick={() => onNavigate('about')} className={linkClasses}>{t('footer.aboutUs')}</button>
                    <button onClick={() => onNavigate('privacy')} className={linkClasses}>{t('footer.privacyPolicy')}</button>
                    <button onClick={() => onNavigate('contact')} className={linkClasses}>{t('footer.contactUs')}</button>
                    
                    <div className="relative" ref={langMenuRef}>
                        <button
                            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                            className="flex items-center gap-1 text-gray-400 hover:text-indigo-400 transition-colors"
                        >
                            <Globe size={16} />
                            <span>{locale === 'ar' ? t('header.arabic') : t('header.english')}</span>
                            <ChevronUp size={16} className={`transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isLangMenuOpen && (
                            <div className="absolute bottom-full mb-2 w-32 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-20 ltr:right-0 rtl:left-0">
                                <button
                                    onClick={() => handleLanguageChange('ar')}
                                    className="w-full text-right rtl:text-right ltr:text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                                >
                                    {t('header.arabic')}
                                </button>
                                <button
                                    onClick={() => handleLanguageChange('en')}
                                    className="w-full text-right rtl:text-right ltr:text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                                >
                                    {t('header.english')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
