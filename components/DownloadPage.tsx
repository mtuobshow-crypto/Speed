
import React, { useState, useEffect, Suspense, lazy, useContext } from 'react';
import { File as FileIcon, Download, Clock, UploadCloud, Share2, Check, AlertTriangle } from 'lucide-react';
import { UploadedFile } from '../types';
import { AppSettingsContext } from '../contexts/AppSettingsContext';
import { useLocalization } from '../contexts/LocalizationContext';

const AdUnit = lazy(() => import('./AdUnit'));

interface DownloadPageProps {
  uploadedFile: UploadedFile;
  onUploadAnother: () => void;
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

const DownloadPage: React.FC<DownloadPageProps> = ({ uploadedFile, onUploadAnother, isAdmin }) => {
    const { settings } = useContext(AppSettingsContext);
    const { t } = useLocalization();
    const { file, title, description, keywords } = uploadedFile;
    const [countdown, setCountdown] = useState(settings.countdownDuration);
    const [downloadReady, setDownloadReady] = useState(false);
    const [objectUrl, setObjectUrl] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        const url = URL.createObjectURL(file);
        setObjectUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    useEffect(() => {
        setDownloadReady(false);
        setCountdown(settings.countdownDuration);
    }, [settings.countdownDuration]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if(settings.countdownDuration > 0) {
            setDownloadReady(true);
        } else {
            setDownloadReady(true);
        }
    }, [countdown, settings.countdownDuration]);

    const handleDownload = () => {
        if (!objectUrl) return;
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleShare = () => {
        if (isCopied) return;
        navigator.clipboard.writeText(window.location.href).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };


  return (
    <div className="w-full max-w-2xl">
        <div className="bg-gray-900/70 backdrop-blur-md border border-gray-700 rounded-2xl shadow-lg p-8 space-y-8">
             <Suspense fallback={<AdPlaceholder height="96px" />}>
                <AdUnit id="download-page-top" isAdmin={isAdmin} defaultHeight="96px" />
            </Suspense>

            <div className="text-center">
                <FileIcon className="w-16 h-16 mx-auto text-indigo-400 mb-4" />
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 truncate" title={title}>{title}</h2>
                <p className="text-gray-300 mt-1">{file.name} &bull; {formatBytes(file.size)}</p>
            </div>
            
            {objectUrl && file.type.startsWith('audio/') && (
                <div className="my-6">
                    <audio src={objectUrl} controls className="w-full rounded-lg" />
                </div>
            )}

            {description && (
                <div className="text-right bg-gray-700/50 p-4 rounded-lg">
                    <h3 className="font-bold text-white mb-3 tracking-wide">{t('downloadPage.fileDescription')}</h3>
                    <p className="text-gray-300 whitespace-pre-wrap text-base leading-relaxed">{description}</p>
                </div>
            )}

            {keywords.length > 0 && (
                <div className="text-right">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {keywords.map(tag => <span key={tag} className="bg-indigo-500/50 text-indigo-200 text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>)}
                    </div>
                </div>
            )}

            <Suspense fallback={<AdPlaceholder height="250px" />}>
                <AdUnit id="download-page-middle" isAdmin={isAdmin} defaultHeight="250px" />
            </Suspense>

            <div className="flex justify-center">
                {downloadReady ? (
                     <button
                        onClick={handleDownload}
                        className="bg-green-500 text-white font-bold py-3 px-10 rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                        <Download size={20} />
                        <span>{t('downloadPage.downloadNow')}</span>
                    </button>
                ) : (
                    <div className="flex items-center space-x-3 space-x-reverse bg-gray-700 text-white font-bold py-3 px-10 rounded-lg">
                        <Clock size={20} />
                        <span>{t('downloadPage.downloadReadyIn', { countdown })}</span>
                    </div>
                )}
            </div>

             <div className="pt-4 border-t border-gray-700/50 space-y-4">
                <div className="flex justify-center items-center gap-4 sm:gap-6 flex-wrap">
                    <button 
                        onClick={handleShare} 
                        className={`text-sm flex items-center gap-2 transition-colors duration-200 ${isCopied ? 'text-green-400 cursor-default' : 'text-indigo-400 hover:text-indigo-300'}`}
                        disabled={isCopied}
                    >
                        {isCopied ? (
                            <>
                                <Check size={16} />
                                <span>{t('downloadPage.copied')}</span>
                            </>
                        ) : (
                            <>
                                <Share2 size={16} />
                                <span>{t('downloadPage.share')}</span>
                            </>
                        )}
                    </button>
                    <button onClick={onUploadAnother} className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-2">
                        <UploadCloud size={16} />
                        <span>{t('downloadPage.uploadAnother')}</span>
                    </button>
                     <a 
                        href={`mailto:abuse@example.com?subject=Report%20Abuse%20for%20File:%20${encodeURIComponent(file.name)}`}
                        className="text-gray-500 hover:text-red-400 text-sm flex items-center gap-2 transition-colors"
                    >
                        <AlertTriangle size={16} />
                        <span>{t('downloadPage.reportAbuse')}</span>
                    </a>
                </div>
                <Suspense fallback={<AdPlaceholder height="90px" />}>
                    <AdUnit id="download-page-bottom" isAdmin={isAdmin} defaultHeight="90px" />
                </Suspense>
            </div>
        </div>
    </div>
  );
};

export default DownloadPage;
