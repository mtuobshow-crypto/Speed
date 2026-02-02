import React, { useState, useEffect, useContext, lazy } from 'react';
import { AppSettingsContext } from '../contexts/AppSettingsContext';
import type { AdConfig } from '../contexts/AppSettingsContext';
import { useLocalization } from '../contexts/LocalizationContext';

const DummyAd = lazy(() => import('./DummyAd'));

interface AdUnitProps {
    id: string;
    isAdmin: boolean;
    defaultHeight: string;
    className?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ id, isAdmin, defaultHeight, className = '' }) => {
    const { settings, ads } = useContext(AppSettingsContext);
    const { t } = useLocalization();
    const [config, setConfig] = useState<AdConfig | null>(null);

    useEffect(() => {
        const adConfig = ads.find(ad => ad.id === id);
        setConfig(adConfig || null);
    }, [id, ads]);
    
    // The admin view remains a placeholder for configuration purposes
    if (isAdmin) {
        const adStyle: React.CSSProperties = {
            width: config?.width || '100%',
            height: config?.height || defaultHeight,
            minHeight: '90px',
        };
        return (
            <div 
                style={adStyle}
                className={`relative bg-gray-700/50 border border-dashed border-gray-500 rounded-lg p-4 transition-all flex flex-col items-center justify-center ${className}`}
            >
                <p className="text-sm text-gray-400 font-mono">Ad Slot: {id}</p>
                {config?.unitId && <p className="text-gray-600 text-xs font-mono mt-1">Slot ID: {config.unitId}</p>}
                <p className="text-gray-600 text-xs font-mono mt-1">Size: {config?.width || '100%'} x {config?.height || defaultHeight}</p>
            </div>
        );
    }

    const adStyle: React.CSSProperties = {
        width: config?.width || '100%',
        height: config?.height || defaultHeight,
        display: 'block',
    };

    // Effect to push ads to Google
    useEffect(() => {
        if (settings.adsensePublisherId && config?.unitId) {
            try {
                // @ts-ignore
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error("AdSense execution error: ", e);
            }
        }
    }, [config, settings.adsensePublisherId]);

    // For regular users, render the actual ad unit or a dummy ad if not configured
    if (!settings.adsensePublisherId || !config?.unitId) {
        return (
            <DummyAd 
                width={config?.width || '100%'} 
                height={config?.height || defaultHeight} 
                className={className} 
            />
        );
    }
    
    return (
        <div className={`relative w-full ${className}`}>
            <span className="absolute top-0 right-3 text-[10px] text-gray-500 bg-gray-900/80 backdrop-blur-sm px-2 rounded-b-md z-10">{t('adUnit.adLabel')}</span>
            <ins
                className="adsbygoogle"
                style={adStyle}
                data-ad-client={settings.adsensePublisherId}
                data-ad-slot={config.unitId}
                data-ad-format="auto"
                data-full-width-responsive="true"
            ></ins>
        </div>
    );
};

export default AdUnit;