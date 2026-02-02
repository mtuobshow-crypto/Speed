
import React, { useState, useEffect, useRef } from 'react';
import { User, Shield, LogIn, LoaderCircle, CheckCircle } from 'lucide-react';
import { UserRole } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [shouldShake, setShouldShake] = useState(false);
    const usernameInputRef = useRef<HTMLInputElement>(null);
    const { t } = useLocalization();

    useEffect(() => {
        usernameInputRef.current?.focus();
    }, [activeTab]);

    const handleTabChange = (tab: 'user' | 'admin') => {
        setActiveTab(tab);
        setLogin('');
        setPassword('');
        setError(null);
        setIsLoading(false);
        setIsSuccess(false);
        setShouldShake(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        setShouldShake(false);

        // Simulate network delay
        setTimeout(() => {
            let success = false;
            if (activeTab === 'user') {
                if (login === 'user' && password === 'user123') {
                    success = true;
                } else {
                    setError(t('loginPage.invalidUser'));
                }
            } else { // admin
                if (login === 'admin' && password === 'admin123') {
                    success = true;
                } else {
                    setError(t('loginPage.invalidAdmin'));
                }
            }
            
            setIsLoading(false);
            if (success) {
                setIsSuccess(true);
                setTimeout(() => {
                    onLogin(activeTab);
                }, 1000);
            } else {
                setShouldShake(true);
                setTimeout(() => setShouldShake(false), 820); // Corresponds to animation duration
            }

        }, 1000);
    };
    
    const isUserTab = activeTab === 'user';

    return (
        <div className={`w-full max-w-md ${shouldShake ? 'animate-shake' : ''}`}>
            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl shadow-indigo-900/20 overflow-hidden">
                <div className="flex">
                    <button 
                        onClick={() => handleTabChange('user')}
                        className={`w-1/2 p-4 font-bold flex items-center justify-center gap-2 rounded-tr-none transition-colors ${isUserTab ? 'bg-indigo-600 text-white' : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'}`}
                    >
                        <User size={18} />
                        <span>{t('loginPage.userLogin')}</span>
                    </button>
                     <button 
                        onClick={() => handleTabChange('admin')}
                        className={`w-1/2 p-4 font-bold flex items-center justify-center gap-2 rounded-tl-none transition-colors ${!isUserTab ? 'bg-purple-600 text-white' : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'}`}
                    >
                        <Shield size={18} />
                        <span>{t('loginPage.adminLogin')}</span>
                    </button>
                </div>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white">
                            {isUserTab ? t('loginPage.welcomeBack') : t('loginPage.adminTitle')}
                        </h2>
                        <p className="text-gray-400 mt-2">
                             {isUserTab ? t('loginPage.welcomeSubtitle') : t('loginPage.adminSubtitle')}
                        </p>
                    </div>
                    
                    {error && <p className="text-red-400 text-center text-sm mb-4 bg-red-900/20 py-2 rounded-md">{error}</p>}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">{t('loginPage.username')}</label>
                            <input
                                ref={usernameInputRef}
                                type="text"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                className={`w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:ring-2 transition-colors ${isUserTab ? 'focus:ring-indigo-500 focus:border-indigo-500' : 'focus:ring-purple-500 focus:border-purple-500'}`}
                                placeholder={isUserTab ? 'user' : 'admin'}
                                required
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">{t('loginPage.password')}</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:ring-2 transition-colors ${isUserTab ? 'focus:ring-indigo-500 focus:border-indigo-500' : 'focus:ring-purple-500 focus:border-purple-500'}`}
                                placeholder={isUserTab ? 'user123' : 'admin123'}
                                required
                            />
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500" />
                                <span>{t('loginPage.rememberMe')}</span>
                            </label>
                            <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">{t('loginPage.forgotPassword')}</a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || isSuccess}
                            className={`w-full text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2
                                ${isLoading ? 'bg-gray-500 cursor-wait' :
                                 isSuccess ? 'bg-green-600' :
                                 isUserTab ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-purple-600 hover:bg-purple-700'}
                            `}
                        >
                            {isLoading ? <LoaderCircle className="animate-spin" size={20} /> : isSuccess ? <CheckCircle size={20} /> : <LogIn size={20} />}
                            <span>
                                {isLoading ? t('loginPage.checking') : isSuccess ? t('loginPage.success') : t('loginPage.loginButton')}
                            </span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
