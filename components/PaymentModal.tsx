import React, { useState, useContext } from 'react';
import { X, CreditCard, Calendar, Lock, LoaderCircle, CheckCircle, ShieldCheck } from 'lucide-react';
import { Page } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';
import { AppSettingsContext, Plan } from '../contexts/AppSettingsContext';

// SVG Icons for payment methods
const VisaIcon: React.FC = () => (
    <svg width="38" height="24" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="pi-visa">
        <title id="pi-visa">Visa</title>
        <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#1A1F71"/>
        <path d="M15.2 18.4h-3.4L8.1 6.3h3.4l2.1 7.9c.1.4.2.8.3 1.1h.1c.1-.3.2-.7.3-1.1L16.3 6.3h2.3l-2.4 12.1zm12.3-5.7c0 2.2-1.3 3.6-3.6 3.6-1.9 0-3.1-1.1-3.1-2.6 0-1.8 1.4-2.6 3.3-2.6h1.5v-1c0-.6-.4-1-1.1-1-.8 0-1.2.3-1.3.6l-2.1-.8c.4-1.2 1.6-2 3.4-2 2.1 0 3.3 1.1 3.3 2.8v3.1zm-2.1.9c.6 0 1-.4 1-.9v-.6h-1.5c-.7 0-1.1.3-1.1.9 0 .4.4.7 1 .7zm-15.1 4.2h2.2l-4.5-12.1h-2.2l4.5 12.1z" fill="#fff"/>
    </svg>
);

const MastercardIcon: React.FC = () => (
    <svg width="38" height="24" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="pi-mastercard">
        <title id="pi-mastercard">Mastercard</title>
        <circle cx="15" cy="12" r="7" fill="#EB001B"/>
        <circle cx="23" cy="12" r="7" fill="#F79E1B"/>
        <path d="M22 12c0-3.9-3.1-7-7-7-1.1 0-2.2.3-3.1.8 1.7 1.1 2.8 3 2.8 5.2s-1.1 4.1-2.8 5.2c.9.5 2 .8 3.1.8 3.9 0 7-3.1 7-7z" fill="#FF5F00"/>
    </svg>
);

const PaypalIcon: React.FC = () => (
  <svg width="80" height="24" viewBox="0 0 80 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#003087" d="M22.4 5.2h-4.3c-.4 0-.8.3-.9.7L15.3 16c-.1.4.3.8.7.8h2.9c.4 0 .8-.3.9-.7l.6-2.5h3.2l-.4 1.8c-.1.4.3.8.7.8h2.6c.4 0 .7-.2.9-.6L23.3 6c.1-.4-.2-.8-.9-.8zM17.8 11.6l.8-3.4.4-1.7h.1l.3 1.7.9 3.4h-2.5z"/>
    <path fill="#009cde" d="M36.1 5.2h-4.3c-.4 0-.8.3-.9.7L29 16c-.1.4.3.8.7.8h2.9c.4 0 .8-.3.9-.7l.6-2.5h3.2l-.4 1.8c-.1.4.3.8.7.8h2.6c.3 0 .7-.2.9-.6l1.4-5.8c.1-.4-.2-.8-.9-.8zm-3.5 6.4l.8-3.4.4-1.7h.1l.3 1.7.9 3.4h-2.5z"/>
    <path fill="#012169" d="M49.8 5.2h-3c-.4 0-.8.3-.9.7l-3.2 12.1h2.8c.4 0 .7-.2.9-.6l.3-1.3h3.2l.3 1.3c.1.4.4.6.9.6h2.7L49.8 5.2zm-1.1 6.4l.8-3.4.4-1.7h.1l.3 1.7.9 3.4h-2.5z"/>
    <path fill="#003087" d="M66.4 8.8c0-.4.3-.8.7-.8h2.4l.8-3.1c.1-.4-.2-.8-.6-.8h-3c-.4 0-.8.3-.9.7l-3.2 12.1h2.8c.4 0 .7-.2.9-.6l.3-1.3h3.2l.3 1.3c.1.4.4.6.9.6h2.7l-2.4-8.8zm-1.1 2.8l.8-3.4.4-1.7h.1l.3 1.7.9 3.4h-2.5z"/>
  </svg>
);

const ApplePayIcon: React.FC = () => (
    <svg width="40" height="24" viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M35.1,10.1c-0.1-2.9-2-5-4.4-5c-1.3,0-2.6,0.6-3.4,0.6c-0.8,0-1.8-0.6-3.2-0.6c-2.4,0-4.3,2.1-4.4,5h-0.1 c-2.8,0-4.8,2.1-4.8,4.8c0,1.2,0.4,2.3,1.2,3.1c-0.6,0.5-1,1.3-1,2.1c0,1.5,1.2,2.7,2.7,2.7c1,0,1.9-0.6,2.4-1.4 c0.6,0.3,1.3,0.5,2,0.5c1.4,0,2.6-0.7,3.3-0.7c0.7,0,1.7,0.7,3.1,0.7c0.8,0,1.5-0.2,2.1-0.5c0.5,0.8,1.4,1.4,2.4,1.4 c1.5,0,2.7-1.2,2.7-2.7c0-0.8-0.4-1.6-1-2.1c0.8-0.8,1.2-1.9,1.2-3.1C39.9,12.2,37.9,10.1,35.1,10.1z M22,3.3 c0.6-0.7,1-1.8,0.9-2.8c-1.1,0-2.3,0.7-3,1.5C20.4,2.5,21.5,2.7,22,3.3z M29.6,3.4c0.5-0.7,0.8-1.5,0.7-2.4 c-0.9,0.1-1.9,0.7-2.5,1.4C28.3,2.8,29.1,3,29.6,3.4z" fill="#FFF"/>
    </svg>
);

interface PaymentModalProps {
    plan: Plan | null;
    onClose: () => void;
    onSuccess: (planName: string) => void;
    onNavigate: (page: Page) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ plan, onClose, onSuccess, onNavigate }) => {
    const { subscriptions } = useContext(AppSettingsContext);
    type PaymentStep = 'selection' | 'card_details' | 'processing' | 'success';
    const [step, setStep] = useState<PaymentStep>('selection');
    const [processingMessage, setProcessingMessage] = useState('');
    const { t } = useLocalization();

    if (!plan) return null;
    
    const enabledGateways = subscriptions.paymentGateways.filter(g => g.enabled);

    const handleSelectMethod = (method: 'card' | 'paypal' | 'apple_pay') => {
        if (method === 'card') {
            setStep('card_details');
            return;
        }

        setStep('processing');
        let message = '';
        if (method === 'paypal') message = t('paymentModal.redirectingPayPal');
        if (method === 'apple_pay') message = t('paymentModal.processingApplePay');
        setProcessingMessage(message);

        // Simulate API call/redirect
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onSuccess(plan.name);
                onClose();
            }, 1500);
        }, 2000);
    };

    const handleCardPayment = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('processing');
        setProcessingMessage(t('paymentModal.processing'));
        // Simulate card processing
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onSuccess(plan.name);
                onClose();
            }, 1500);
        }, 2000);
    };
    
    const handleNavigateToHistory = () => {
        onClose();
        onNavigate('paymentHistory');
    };

    const gatewayComponents = {
        card: {
            label: t('paymentModal.creditCard'),
            icons: <><VisaIcon /><MastercardIcon /></>,
            className: "bg-gray-700 hover:bg-gray-600"
        },
        paypal: {
            label: t('paymentModal.paypal'),
            icons: <PaypalIcon />,
            className: "bg-gray-700 hover:bg-gray-600"
        },
        apple_pay: {
            label: t('paymentModal.applePay'),
            icons: <ApplePayIcon />,
            className: "bg-black hover:bg-gray-900"
        }
    };

    const renderContent = () => {
        switch (step) {
            case 'selection':
                return (
                    <>
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-white">{t('paymentModal.selectMethodTitle')}</h2>
                            <p className="text-gray-400 mt-1">{t('paymentModal.subtitle', { planName: plan.name })}</p>
                        </div>
                        <div className="space-y-3">
                            {enabledGateways.map(gateway => {
                                const component = gatewayComponents[gateway.id];
                                if (!component) return null;
                                return (
                                    <button 
                                        key={gateway.id} 
                                        onClick={() => handleSelectMethod(gateway.id)} 
                                        className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${component.className}`}
                                    >
                                        <span className="font-semibold">{component.label}</span>
                                        <div className="flex items-center gap-2">{component.icons}</div>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="text-center text-xs text-gray-500 mt-6 flex items-center justify-center gap-2">
                            <ShieldCheck size={14} />
                            <span>{t('paymentModal.securePayment')}</span>
                        </div>
                    </>
                );

            case 'card_details':
                return (
                    <>
                         <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-white">{t('paymentModal.title')}</h2>
                            <p className="text-gray-400 mt-1">{t('paymentModal.subtitle', { planName: plan.name })}</p>
                        </div>
                        <form onSubmit={handleCardPayment}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300 mb-1">{t('paymentModal.cardNumber')}</label>
                                    <div className="relative">
                                        <CreditCard className="absolute top-1/2 -translate-y-1/2 right-3 w-5 h-5 text-gray-400" />
                                        <input type="text" id="cardNumber" placeholder="**** **** **** 1234" required className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 pl-10 text-white focus:ring-indigo-500 focus:border-indigo-500"/>
                                    </div>
                                </div>
                                <div className="flex space-x-4 space-x-reverse">
                                    <div className="w-1/2">
                                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-300 mb-1">{t('paymentModal.expiryDate')}</label>
                                        <div className="relative">
                                            <Calendar className="absolute top-1/2 -translate-y-1/2 right-3 w-5 h-5 text-gray-400" />
                                            <input type="text" id="expiryDate" placeholder="MM/YY" required className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 pl-10 text-white focus:ring-indigo-500 focus:border-indigo-500"/>
                                        </div>
                                    </div>
                                    <div className="w-1/2">
                                        <label htmlFor="cvc" className="block text-sm font-medium text-gray-300 mb-1">{t('paymentModal.cvc')}</label>
                                        <div className="relative">
                                            <Lock className="absolute top-1/2 -translate-y-1/2 right-3 w-5 h-5 text-gray-400" />
                                            <input type="text" id="cvc" placeholder="123" required className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 pl-10 text-white focus:ring-indigo-500 focus:border-indigo-500"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="w-full mt-8 font-bold py-3 rounded-lg flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300">
                                {t('paymentModal.payButton', { price: plan.price })}
                            </button>
                        </form>
                    </>
                );
            
            case 'processing':
                return (
                    <div className="text-center py-10 flex flex-col items-center justify-center">
                        <LoaderCircle className="animate-spin w-16 h-16 text-indigo-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white">{processingMessage}</h3>
                    </div>
                );

            case 'success':
                return (
                    <div className="text-center py-10">
                        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white">{t('paymentModal.thankYou')}</h3>
                        <p className="text-gray-400">{t('paymentModal.successMessage')}</p>
                        <button onClick={handleNavigateToHistory} className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors mt-6">
                            {t('paymentModal.viewHistory')}
                        </button>
                    </div>
                );
        }
    };
    
    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={step !== 'processing' ? onClose : undefined}
        >
            <div 
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl w-full max-w-md p-8 relative transform transition-all animate-slide-in"
                onClick={(e) => e.stopPropagation()}
            >
                {step !== 'processing' && (
                    <button onClick={onClose} className="absolute top-4 left-4 rtl:right-4 rtl:left-auto text-gray-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                )}
                {renderContent()}
            </div>
        </div>
    );
};

export default PaymentModal;