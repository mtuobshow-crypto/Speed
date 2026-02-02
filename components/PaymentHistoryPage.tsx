
import React from 'react';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { Page } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';

interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: string;
}

interface PaymentHistoryPageProps {
    transactions: Transaction[];
    onNavigate: (page: Page) => void;
}

const PaymentHistoryPage: React.FC<PaymentHistoryPageProps> = ({ transactions, onNavigate }) => {
    const { t, locale } = useLocalization();
    const dateLocale = locale === 'ar' ? 'ar-EG' : 'en-US';

    return (
        <div className="w-full max-w-2xl">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-white">{t('paymentHistory.title')}</h1>
                    <button
                        onClick={() => onNavigate('plans')}
                        className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        <span>{t('paymentHistory.backToPlans')}</span>
                        <ArrowLeft size={20} />
                    </button>
                </div>

                {transactions.length > 0 ? (
                    <ul className="space-y-4">
                        {transactions.map((tx) => (
                            <li key={tx.id} className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-800 p-3 rounded-full">
                                        <CreditCard size={20} className="text-green-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">{tx.description}</p>
                                        <p className="text-sm text-gray-400">{new Date(tx.date).toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-lg text-white">{tx.amount}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-400">{t('paymentHistory.noTransactions')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentHistoryPage;
