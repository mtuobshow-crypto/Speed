
import React, { useState, useEffect, Suspense, lazy, useContext } from 'react';
import { UploadedFile } from '../types';
import { FileText, ShieldCheck } from 'lucide-react';
import { AppSettingsContext } from '../contexts/AppSettingsContext';
import { useLocalization } from '../contexts/LocalizationContext';

const AdUnit = lazy(() => import('./AdUnit'));

interface PreDownloadPageProps {
  uploadedFile: UploadedFile;
  onTimerEnd: () => void;
  isAdmin: boolean;
}

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت', 'تيرابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const AdPlaceholder: React.FC<{ height: string, className?: string }> = ({ height, className = '' }) => {
    const { t } = useLocalization();
    return (
        <div
            style={{ height }}
            className={`bg-gray-700/50 border border-dashed border-gray-500 rounded-lg flex items-center justify-center text-gray-500 ${className}`}
        >
            <p className="text-sm">{t('adUnit.loading')}</p>
        </div>
    );
};


const PreDownloadPage: React.FC<PreDownloadPageProps> = ({ uploadedFile, onTimerEnd, isAdmin }) => {
    const { settings } = useContext(AppSettingsContext);
    const { t } = useLocalization();
    const [countdown, setCountdown] = useState(settings.preDownloadDelay);

    useEffect(() => {
        setCountdown(settings.preDownloadDelay);
    }, [settings.preDownloadDelay]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            onTimerEnd();
        }
    }, [countdown, onTimerEnd]);
    
    const progress = settings.preDownloadDelay > 0 ? ((settings.preDownloadDelay - countdown) / settings.preDownloadDelay) * 100 : 100;
    const circumference = 2 * Math.PI * 52; // 2 * pi * radius

    return (
        <div className="w-full max-w-lg">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl shadow-indigo-900/20 p-8 text-center space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">{t('preDownloadPage.title')}</h1>
                    <p className="text-gray-400">{t('preDownloadPage.subtitle')}</p>
                </div>

                <div className="bg-gray-700/50 p-4 rounded-lg flex items-center space-x-4 space-x-reverse">
                    <div className="flex-shrink-0 bg-gray-800 w-16 h-16 rounded-lg flex items-center justify-center">
                        <FileText className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div className="flex-grow overflow-hidden text-right">
                        <p className="text-md font-medium text-white truncate" title={uploadedFile.title}>
                            {uploadedFile.title}
                        </p>
                        <p className="text-sm text-gray-400">{formatBytes(uploadedFile.file.size)}</p>
                    </div>
                </div>

                <Suspense fallback={<AdPlaceholder height="250px" />}>
                    <AdUnit id="pre-download-page" isAdmin={isAdmin} defaultHeight="250px" />
                </Suspense>

                <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-full h-full" viewBox="0 0 120 120">
                        <circle
                            className="text-gray-700"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                            r="52"
                            cx="60"
                            cy="60"
                        />
                        <circle
                            className="text-indigo-500 transition-all duration-1000 ease-linear"
                            strokeWidth="8"
                            strokeDasharray={circumference}
                            strokeDashoffset={circumference - (progress / 100) * circumference}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="52"
                            cx="60"
                            cy="60"
                            transform="rotate(-90 60 60)"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white">
                        {countdown}
                    </div>
                </div>
                
                <div className="text-right bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                    <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                        <ShieldCheck size={20} className="text-green-400" />
                        <span>{t('preDownloadPage.usagePolicyTitle')}</span>
                    </h3>
                    <div className="text-xs text-gray-400 max-h-24 overflow-y-auto pr-2 space-y-2">
                       <p>
                            {t('preDownloadPage.policy1')}
                        </p>
                        <p>
                           {t('preDownloadPage.policy2')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreDownloadPage;
