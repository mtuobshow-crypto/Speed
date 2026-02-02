import React, { useState } from 'react';
import { X, Copy, Check, QrCode, Share2, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { useLocalization } from '../contexts/LocalizationContext';
import QRCode from './QRCode';

interface ShareModalProps {
    url: string;
    onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ url, onClose }) => {
    const { t } = useLocalization();
    const [isCopied, setIsCopied] = useState(false);
    const [showQr, setShowQr] = useState(false);

    const handleCopy = () => {
        if (isCopied) return;
        navigator.clipboard.writeText(url).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    const socialShare = (platform: 'twitter' | 'facebook' | 'whatsapp') => {
        const text = encodeURIComponent(t('shareModal.shareText'));
        let shareUrl = '';
        switch(platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://api.whatsapp.com/send?text=${text}%20${encodeURIComponent(url)}`;
                break;
        }
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl w-full max-w-lg p-6 relative transform transition-all animate-slide-in"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 left-4 rtl:right-4 rtl:left-auto text-gray-500 hover:text-white transition-colors">
                    <X size={24} />
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white">{t('shareModal.title')}</h2>
                    <p className="text-gray-400 mt-1">{t('shareModal.subtitle')}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 bg-gray-900/50 p-2 rounded-lg">
                    <input 
                        type="text"
                        value={url}
                        readOnly
                        className="w-full bg-transparent text-gray-300 text-sm p-2 focus:outline-none"
                    />
                    <button 
                        onClick={handleCopy}
                        className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${isCopied ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                    >
                        {isCopied ? <Check size={16} /> : <Copy size={16} />}
                        <span>{isCopied ? t('shareModal.copied') : t('shareModal.copy')}</span>
                    </button>
                </div>

                <div className="mt-6 flex justify-center items-center gap-4">
                    <button onClick={() => socialShare('twitter')} className="p-3 bg-gray-700 rounded-full hover:bg-blue-500 text-white transition-colors"><Twitter size={20} /></button>
                    <button onClick={() => socialShare('facebook')} className="p-3 bg-gray-700 rounded-full hover:bg-blue-700 text-white transition-colors"><Facebook size={20} /></button>
                    <button onClick={() => socialShare('whatsapp')} className="p-3 bg-gray-700 rounded-full hover:bg-green-500 text-white transition-colors"><MessageCircle size={20} /></button>
                    <button onClick={() => setShowQr(!showQr)} className={`p-3 bg-gray-700 rounded-full hover:bg-gray-600 text-white transition-colors ${showQr ? 'bg-indigo-600' : ''}`}><QrCode size={20} /></button>
                </div>
                
                {showQr && (
                    <div className="mt-6 p-4 bg-white rounded-lg flex justify-center">
                        <QRCode value={url} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShareModal;
