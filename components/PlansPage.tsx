import React, { useState, useContext } from 'react';
import { CheckCircle } from 'lucide-react';
import PaymentModal from './PaymentModal';
import { UserRole, Page } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';
import { AppSettingsContext, Plan } from '../contexts/AppSettingsContext';

const PlanCard: React.FC<{
    plan: Plan;
    onSubscribe: (plan: Plan) => void;
    isCurrentPlan: boolean;
    isProcessing: boolean;
}> = ({ plan, onSubscribe, isCurrentPlan, isProcessing }) => {
    const { t } = useLocalization();
    const cardClasses = `bg-gray-800 border rounded-2xl p-8 flex flex-col relative overflow-hidden transition-all duration-300 ${plan.isPopular ? 'border-indigo-500' : 'border-gray-700 hover:border-gray-600'}`;
    
    let buttonText = plan.isPopular ? t('plansPage.startNow') : t('plansPage.choosePlan');
    let buttonClasses = `w-full mt-auto font-bold py-3 rounded-lg transition-all duration-300 ${plan.isPopular ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-700 text-white hover:bg-gray-600'}`;

    if (isCurrentPlan) {
        buttonText = t('plansPage.currentPlan');
        buttonClasses = 'w-full mt-auto font-bold py-3 rounded-lg bg-green-600 text-white cursor-default';
    }

    const isFreePlan = plan.price === '$0';

    return (
        <div className={cardClasses}>
            {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-8 py-1 transform translate-x-1/4 rotate-45 translate-y-4">
                    الأكثر شيوعاً
                </div>
            )}
            <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
            <p className="text-gray-400 mt-2">{plan.description}</p>
            <div className="my-8">
                <span className="text-5xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-400">/شهرياً</span>
            </div>
            <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3 space-x-reverse">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                    </li>
                ))}
            </ul>
            <button 
                className={buttonClasses} 
                onClick={() => onSubscribe(plan)}
                disabled={isCurrentPlan || isProcessing || isFreePlan}
            >
                {buttonText}
            </button>
        </div>
    );
};

interface PlansPageProps {
    subscribedPlan: string | null;
    onPaymentSuccess: (plan: Plan) => void;
    onNavigate: (page: Page) => void;
    currentUser: UserRole;
}

const PlansPage: React.FC<PlansPageProps> = ({ subscribedPlan, onPaymentSuccess, onNavigate, currentUser }) => {
    const { subscriptions } = useContext(AppSettingsContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const { t } = useLocalization();
    
    const displayedPlans = subscriptions.plans.filter(p => p.enabled);

    const handleSubscribeClick = (plan: Plan) => {
        if (plan.price === '$0') return;
        
        if (!currentUser) {
            onNavigate('login');
            return;
        }

        setSelectedPlan(plan);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPlan(null);
    };

    const handlePaymentSuccess = (planName: string) => {
        const plan = subscriptions.plans.find(p => p.name === planName);
        if (plan) {
            onPaymentSuccess(plan);
        }
    };

    return (
        <>
            <div className="w-full max-w-5xl text-center">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                    {t('plansPage.title')}
                </h1>
                <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                    {t('plansPage.subtitle')}
                </p>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
                    {displayedPlans.map((plan) => (
                        <PlanCard 
                            key={plan.id} 
                            plan={plan}
                            onSubscribe={handleSubscribeClick}
                            isCurrentPlan={subscribedPlan === plan.name}
                            isProcessing={isModalOpen && selectedPlan?.name === plan.name}
                        />
                    ))}
                </div>
            </div>
            {isModalOpen && selectedPlan && (
                <PaymentModal 
                    plan={selectedPlan} 
                    onClose={handleCloseModal}
                    onSuccess={handlePaymentSuccess}
                    onNavigate={onNavigate}
                />
            )}
        </>
    );
};

export default PlansPage;