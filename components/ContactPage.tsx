
import React, { useState, useContext } from 'react';
import { Send, MapPin, Mail, Phone, LoaderCircle, CheckCircle } from 'lucide-react';
import { AppSettingsContext } from '../contexts/AppSettingsContext';
import { useLocalization } from '../contexts/LocalizationContext';

const ContactInfoCard: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="flex items-start space-x-4 space-x-reverse">
        <div className="flex-shrink-0 bg-indigo-500/20 text-indigo-400 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <div className="text-gray-400 mt-1">{children}</div>
        </div>
    </div>
);

const ContactPage: React.FC = () => {
    const { pages } = useContext(AppSettingsContext);
    const { t } = useLocalization();
    const { title, subtitle, address, email, phone } = pages.contact;
    
    const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setTimeout(() => {
            setStatus('sent');
        }, 2000);
    };

    return (
        <div className="w-full max-w-5xl">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg overflow-hidden">
                <div className="p-8 md:p-12 text-center">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                        {title}
                    </h1>
                    <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 bg-gray-800/50">
                    {/* Contact Form */}
                    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-8">
                        {status === 'sent' ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
                                <h3 className="text-2xl font-bold text-white">{t('contactPage.sentTitle')}</h3>
                                <p className="text-gray-400 mt-2">{t('contactPage.sentSubtitle')}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex flex-col sm:flex-row gap-6">
                                    <div className="w-full">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">{t('contactPage.formName')}</label>
                                        <input type="text" name="name" id="name" required value={formState.name} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"/>
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">{t('contactPage.formEmail')}</label>
                                        <input type="email" name="email" id="email" required value={formState.email} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"/>
                                    </div>
                                </div>
                                 <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">{t('contactPage.formSubject')}</label>
                                    <input type="text" name="subject" id="subject" required value={formState.subject} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"/>
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">{t('contactPage.formMessage')}</label>
                                    <textarea name="message" id="message" rows={5} required value={formState.message} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:bg-indigo-500 disabled:cursor-not-allowed"
                                >
                                    {status === 'sending' ? (
                                        <>
                                            <LoaderCircle className="animate-spin" size={20} />
                                            <span>{t('contactPage.sending')}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            <span>{t('contactPage.sendMessage')}</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                    
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <ContactInfoCard icon={<MapPin size={24}/>} title={t('contactPage.address')}>
                            <p>{address}</p>
                        </ContactInfoCard>
                         <ContactInfoCard icon={<Mail size={24}/>} title={t('contactPage.email')}>
                            <a href={`mailto:${email}`} className="hover:text-indigo-300 transition-colors">{email}</a>
                        </ContactInfoCard>
                         <ContactInfoCard icon={<Phone size={24}/>} title={t('contactPage.phone')}>
                            <a href={`tel:${phone.replace(/[()-\s]/g, '')}`} className="hover:text-indigo-300 transition-colors">{phone}</a>
                        </ContactInfoCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
