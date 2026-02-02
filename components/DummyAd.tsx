import React from 'react';
import { Megaphone } from 'lucide-react';
import { useLocalization } from '../contexts/LocalizationContext';

interface DummyAdProps {
    width: string;
    height: string;
    className?: string;
}

const DummyAd: React.FC<DummyAdProps> = ({ width, height, className = '' }) => {
    const { t } = useLocalization();

    const adStyle: React.CSSProperties = {
        width,
        height,
    };

    return (
        <div 
            style={adStyle}
            className={`relative bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 rounded-lg p-4 transition-all flex flex-col items-center justify-center text-center overflow-hidden ${className}`}
        >
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-12 -left-4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <div className="p-3 bg-indigo-500/30 rounded-full mb-3">
                    <Megaphone className="w-8 h-8 text-indigo-300" />
                </div>
                <h4 className="font-bold text-white text-lg">{t('dummyAd.title')}</h4>
                <p className="text-gray-400 text-sm mt-1 mb-4">{t('dummyAd.text')}</p>
                <button className="bg-indigo-600 text-white text-xs font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                    {t('dummyAd.callToAction')}
                </button>
            </div>
            <span className="absolute top-2 left-2 text-[10px] text-gray-500 bg-gray-900/50 px-2 rounded-md z-10">{t('adUnit.adLabel')}</span>
        </div>
    );
};

export default DummyAd;