import React, { useState } from 'react';
import { X, ShieldAlert, Send, LoaderCircle, CheckCircle } from 'lucide-react';
import { useLocalization } from '../contexts/LocalizationContext';

interface ReportModalProps {
    fileName: string;
    onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ fileName, onClose }) => {
    const { t } = useLocalization();
    const [reason, setReason] = useState('');
    const [details, setDetails] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason) return;
        setStatus('sending');
        setTimeout(() => {
            setStatus('sent');
            setTimeout(onClose, 2000);
        }, 1500);
    };

    const reportReasons = [
        t('reportModal.reasonCopyright'),
        t('reportModal.reasonIllegal'),
        t('reportModal.reasonHate'),
        t('reportModal.reasonSpam'),
        t('reportModal.reasonOther'),
    ];

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
                    <h2 className="text-2xl font-bold text-white">{t('reportModal.title')}</h2>
                    <p className="text-gray-400 mt-1 truncate" title={fileName}>{t('reportModal.reportingFile', { fileName })}</p>
                </div>

                {status === 'sent' ? (
                    <div className="flex flex-col items-center justify-center h-48 text-center">
                        <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
                        <h3 className="text-xl font-bold text-white">{t('reportModal.successTitle')}</h3>
                        <p className="text-gray-400 mt-2">{t('reportModal.successSubtitle')}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-2">{t('reportModal.reasonLabel')}</label>
                            <select
                                id="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="" disabled>{t('reportModal.reasonPlaceholder')}</option>
                                {reportReasons.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="details" className="block text-sm font-medium text-gray-300 mb-2">{t('reportModal.detailsLabel')}</label>
                            <textarea
                                id="details"
                                rows={4}
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder={t('reportModal.detailsPlaceholder')}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={status === 'sending' || !reason}
                            className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:bg-red-500/50 disabled:cursor-not-allowed"
                        >
                            {status === 'sending' ? (
                                <>
                                    <LoaderCircle className="animate-spin" size={20} />
                                    <span>{t('reportModal.sending')}</span>
                                </>
                            ) : (
                                <>
                                    <ShieldAlert size={20} />
                                    <span>{t('reportModal.submitButton')}</span>
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ReportModal;
