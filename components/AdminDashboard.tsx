import React, { useState, useContext, useRef, useEffect } from 'react';
import { Users, File as FileIcon, Download, DollarSign, Edit, Trash2, Settings, LoaderCircle, Monitor, Megaphone, BookOpen, Save, PlusCircle, Bold, Italic, List, ListOrdered, Mail, X, Image as ImageIcon, TrendingUp, CreditCard } from 'lucide-react';
import Notification from './Notification';
import { AppSettingsContext, AdConfig, ContactPageContent, SubscriptionSettings } from '../contexts/AppSettingsContext';
import { useLocalization } from '../contexts/LocalizationContext';

const AdminDashboard: React.FC = () => {
    const { settings, updateSettings, ads, updateAds, pages, updatePageContent, subscriptions, updateSubscriptions } = useContext(AppSettingsContext);
    const { t } = useLocalization();

    const [activeTab, setActiveTab] = useState('general');
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    
    // State for general settings form
    const [siteIcon, setSiteIcon] = useState<string | null>(settings.siteIcon);
    const [countdownDuration, setCountdownDuration] = useState(settings.countdownDuration);
    const [preDownloadDelay, setPreDownloadDelay] = useState(settings.preDownloadDelay);
    const [maxFileSize, setMaxFileSize] = useState(settings.maxFileSize);
    const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenanceMode);
    const [downloadBgType, setDownloadBgType] = useState(settings.downloadPageBackground.type);
    const [downloadBgColor, setDownloadBgColor] = useState(settings.downloadPageBackground.type === 'color' ? settings.downloadPageBackground.value : '#111827');
    const [downloadBgImage, setDownloadBgImage] = useState<string | null>(settings.downloadPageBackground.type === 'image' ? settings.downloadPageBackground.value : null);
    const [adsensePublisherId, setAdsensePublisherId] = useState(settings.adsensePublisherId);

    // State for SEO settings form
    const [siteTitle, setSiteTitle] = useState(settings.siteTitle);
    const [siteDescription, setSiteDescription] = useState(settings.siteDescription);
    const [siteKeywords, setSiteKeywords] = useState(settings.siteKeywords);
    const [keywordInput, setKeywordInput] = useState('');
    const [robotsTxt, setRobotsTxt] = useState(settings.robotsTxtContent);
    const [sitemapXml, setSitemapXml] = useState(settings.sitemapXmlContent);
    const [ogImage, setOgImage] = useState<string | null>(settings.ogImage);
    const [enableStructuredData, setEnableStructuredData] = useState(settings.enableStructuredData);

    // State for Ad Management
    const [adConfigs, setAdConfigs] = useState<AdConfig[]>(ads);
    
    // State for Subscriptions Management
    const [subscriptionSettings, setSubscriptionSettings] = useState<SubscriptionSettings>(subscriptions);

    // State for Page Management
    const [selectedPage, setSelectedPage] = useState<'about' | 'privacy' | 'contact'>('about');
    const [textContent, setTextContent] = useState(pages.about);
    const [contactInfo, setContactInfo] = useState<ContactPageContent>(pages.contact);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    useEffect(() => {
      setAdConfigs(ads);
    }, [ads]);

    useEffect(() => {
      setSubscriptionSettings(subscriptions);
    }, [subscriptions]);
    
    useEffect(() => {
        if (selectedPage === 'contact') {
            setContactInfo(pages.contact);
        } else {
            setTextContent(pages[selectedPage] as string);
        }
    }, [selectedPage, pages]);
    
    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleSaveGeneralSettings = () => {
        setIsSaving(true);
        setTimeout(() => {
            const downloadPageBackground = {
                type: downloadBgType,
                value: downloadBgType === 'image' && downloadBgImage ? downloadBgImage : downloadBgColor,
            };
            updateSettings({ 
                siteIcon, 
                countdownDuration, 
                preDownloadDelay,
                maxFileSize,
                maintenanceMode,
                downloadPageBackground,
                adsensePublisherId,
            });
            setIsSaving(false);
            showNotification(t('admin.notifSaveSuccess'));
        }, 1000);
    };
    
    const handleSaveSeoSettings = () => {
        setIsSaving(true);
        setTimeout(() => {
            updateSettings({
                siteTitle,
                siteDescription,
                siteKeywords,
                robotsTxtContent: robotsTxt,
                sitemapXmlContent: sitemapXml,
                ogImage,
                enableStructuredData,
            });
            setIsSaving(false);
            showNotification(t('admin.notifSaveSuccess'));
        }, 1000);
    };
    
    const handleAdConfigChange = (index: number, field: keyof Omit<AdConfig, 'id'>, value: string) => {
        const newConfigs = [...adConfigs];
        newConfigs[index] = { ...newConfigs[index], [field]: value };
        setAdConfigs(newConfigs);
    };

    const handleSaveAdSettings = () => {
        setIsSaving(true);
        setTimeout(() => {
            updateAds(adConfigs);
            setIsSaving(false);
            showNotification(t('admin.notifSaveSuccess'));
        }, 1000);
    };
    
    const handleSaveSubscriptions = () => {
        setIsSaving(true);
        setTimeout(() => {
            updateSubscriptions(subscriptionSettings);
            setIsSaving(false);
            showNotification(t('admin.notifSaveSuccess'));
        }, 1000);
    };

    const handleContactInfoChange = (field: keyof ContactPageContent, value: string) => {
        setContactInfo(prev => ({...prev, [field]: value}));
    };

    const handleSavePageContent = () => {
        setIsSaving(true);
        setTimeout(() => {
            if (selectedPage === 'contact') {
                 updatePageContent('contact', contactInfo);
            } else {
                updatePageContent(selectedPage, textContent);
            }
            setIsSaving(false);
            showNotification(t('admin.notifSaveSuccess'));
        }, 1000);
    };
    
    const handleTextFormat = (format: 'bold' | 'italic' | 'ul' | 'ol') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);

        if (selectedText.length === 0) return;

        let formattedText;
        let finalSelectionStart = start;
        let finalSelectionEnd = end;

        switch (format) {
            case 'bold':
                formattedText = `<b>${selectedText}</b>`;
                finalSelectionStart = start + 3;
                finalSelectionEnd = end + 3;
                break;
            case 'italic':
                formattedText = `<i>${selectedText}</i>`;
                finalSelectionStart = start + 3;
                finalSelectionEnd = end + 3;
                break;
            case 'ul':
            case 'ol':
                const lines = selectedText.split('\n').map(line => line.trim() ? `\t<li>${line}</li>` : '');
                formattedText = `<${format}>\n${lines.join('\n')}\n</${format}>`;
                break;
            default:
                formattedText = selectedText;
        }

        const newContent = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
        setTextContent(newContent);
        
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(finalSelectionStart, finalSelectionEnd);
        }, 0);
    };
    
    const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newKeyword = keywordInput.trim();
            if (newKeyword && !siteKeywords.includes(newKeyword)) {
                setSiteKeywords([...siteKeywords, newKeyword]);
            }
            setKeywordInput('');
        }
    };

    const removeKeyword = (keywordToRemove: string) => {
        setSiteKeywords(siteKeywords.filter(kw => kw !== keywordToRemove));
    };

    const handleFileChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setter(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setDownloadBgImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const removeBgImage = () => {
        setDownloadBgImage(null);
        setDownloadBgType('color');
    };

    // --- Subscription Management Handlers ---

    const handlePlanChange = (index: number, field: string, value: any) => {
        const newPlans = [...subscriptionSettings.plans];
        // Handle marking one plan as popular
        if (field === 'isPopular' && value === true) {
            newPlans.forEach((plan, i) => {
                plan.isPopular = i === index;
            });
        } else {
            (newPlans[index] as any)[field] = value;
        }
        setSubscriptionSettings(prev => ({...prev, plans: newPlans}));
    };

    const handleFeatureChange = (planIndex: number, featureIndex: number, value: string) => {
        const newPlans = [...subscriptionSettings.plans];
        newPlans[planIndex].features[featureIndex] = value;
        setSubscriptionSettings(prev => ({...prev, plans: newPlans}));
    };

    const addFeature = (planIndex: number) => {
        const newPlans = [...subscriptionSettings.plans];
        newPlans[planIndex].features.push('');
        setSubscriptionSettings(prev => ({...prev, plans: newPlans}));
    };

    const removeFeature = (planIndex: number, featureIndex: number) => {
        const newPlans = [...subscriptionSettings.plans];
        newPlans[planIndex].features.splice(featureIndex, 1);
        setSubscriptionSettings(prev => ({...prev, plans: newPlans}));
    };
    
    const handleGatewayChange = (index: number, field: string, value: any) => {
        const newGateways = [...subscriptionSettings.paymentGateways];
        (newGateways[index] as any)[field] = value;
        setSubscriptionSettings(prev => ({...prev, paymentGateways: newGateways}));
    }

    // --- End Subscription Handlers ---


    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 space-y-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Settings size={20} />
                            <span>{t('admin.generalSettings.title')}</span>
                        </h2>
                        {/* Site Icon */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">{t('admin.generalSettings.siteIcon')}</label>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600">
                                    {siteIcon ? <img src={siteIcon} alt="Site Icon Preview" className="w-full h-full object-contain" /> : <ImageIcon size={32} className="text-gray-500"/>}
                                </div>
                                <label htmlFor="icon-upload" className="cursor-pointer bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg text-sm">
                                    {t('admin.generalSettings.changeIcon')}
                                </label>
                                <input id="icon-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange(setSiteIcon)} />
                            </div>
                        </div>

                        {/* AdSense Publisher ID */}
                         <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">{t('admin.generalSettings.adsenseId')}</label>
                            <input 
                                type="text" 
                                value={adsensePublisherId} 
                                onChange={e => setAdsensePublisherId(e.target.value)} 
                                placeholder="e.g., ca-pub-xxxxxxxxxxxxxxxx"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white font-mono"
                            />
                        </div>

                        {/* Countdown Timers & File Size */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">{t('admin.generalSettings.downloadCountdown')}</label>
                                <input type="number" value={countdownDuration} onChange={e => setCountdownDuration(Number(e.target.value))} min="0" className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">{t('admin.generalSettings.preDownloadCountdown')}</label>
                                <input type="number" value={preDownloadDelay} onChange={e => setPreDownloadDelay(Number(e.target.value))} min="0" className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">{t('admin.generalSettings.maxFileSize')}</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        value={maxFileSize} 
                                        onChange={e => setMaxFileSize(Number(e.target.value))} 
                                        min="1" 
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white pl-12 rtl:pr-12 rtl:pl-3"
                                    />
                                    <span className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 text-gray-400">MB</span>
                                </div>
                            </div>
                        </div>
                        {/* Download Page Background */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">{t('admin.generalSettings.downloadBg')}</label>
                            <div className="bg-gray-700/50 p-4 rounded-lg space-y-4">
                                <div className="flex items-center gap-6" dir="rtl">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="bgType" value="color" checked={downloadBgType === 'color'} onChange={() => setDownloadBgType('color')} className="form-radio bg-gray-600 border-gray-500 text-indigo-500 focus:ring-indigo-500" />
                                        <span>{t('admin.generalSettings.solidColor')}</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="bgType" value="image" checked={downloadBgType === 'image'} onChange={() => setDownloadBgType('image')} className="form-radio bg-gray-600 border-gray-500 text-indigo-500 focus:ring-indigo-500" />
                                        <span>{t('admin.generalSettings.image')}</span>
                                    </label>
                                </div>
                                {downloadBgType === 'color' ? (
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={downloadBgColor} onChange={e => setDownloadBgColor(e.target.value)} className="w-10 h-10 p-0 border-none rounded bg-gray-600 cursor-pointer" />
                                        <input type="text" value={downloadBgColor} onChange={e => setDownloadBgColor(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white font-mono"/>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <div className="w-24 h-16 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600 overflow-hidden">
                                            {downloadBgImage ? <img src={downloadBgImage} alt="Background Preview" className="w-full h-full object-cover" /> : <ImageIcon size={32} className="text-gray-500"/>}
                                        </div>
                                        <div className="flex-grow">
                                            <label htmlFor="bg-image-upload" className="cursor-pointer bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg text-sm w-full text-center block">
                                                {t('admin.generalSettings.changeImage')}
                                            </label>
                                            <input id="bg-image-upload" type="file" className="hidden" accept="image/*" onChange={handleBgImageChange} />
                                        </div>
                                        {downloadBgImage && (
                                            <button onClick={removeBgImage} className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg" title={t('admin.generalSettings.removeImage')}>
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Maintenance Mode */}
                        <div className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
                            <label htmlFor="maintenance" className="font-medium text-white">{t('admin.generalSettings.maintenanceMode')}</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" id="maintenance" className="sr-only peer" checked={maintenanceMode} onChange={() => setMaintenanceMode(!maintenanceMode)} />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                        <button onClick={handleSaveGeneralSettings} disabled={isSaving} className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                           {isSaving ? <><LoaderCircle className="animate-spin" size={18} /><span>{t('admin.generalSettings.saving')}</span></> : <><Save size={18} /><span>{t('admin.generalSettings.saveSettings')}</span></>}
                        </button>
                    </div>
                );
            case 'seo':
                return (
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 space-y-8">
                         <h2 className="text-xl font-bold flex items-center gap-2">
                            <TrendingUp size={20} />
                            <span>{t('admin.seo.title')}</span>
                        </h2>

                        {/* Meta Tags Section */}
                        <div className="space-y-6 bg-gray-700/30 p-4 rounded-lg">
                             <h3 className="font-semibold text-lg text-indigo-400">{t('admin.seo.metaTagsTitle')}</h3>
                             <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">{t('admin.generalSettings.siteTitle')}</label>
                                <input type="text" value={siteTitle} onChange={e => setSiteTitle(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">{t('admin.generalSettings.siteDescription')}</label>
                                <textarea value={siteDescription} onChange={e => setSiteDescription(e.target.value)} rows={3} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white"></textarea>
                            </div>
                             <div>
                               <label className="block text-sm font-medium text-gray-300 mb-2">{t('admin.generalSettings.siteKeywords')}</label>
                               <div className="bg-gray-700 border border-gray-600 rounded-lg p-2 flex flex-wrap gap-2 items-center">
                                    {siteKeywords.map((kw) => (
                                        <span key={kw} className="flex items-center gap-1 bg-indigo-600 text-white text-sm font-medium px-2 py-1 rounded">
                                            {kw}
                                            <button onClick={() => removeKeyword(kw)} className="text-indigo-200 hover:text-white">
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                    <input 
                                        type="text" 
                                        value={keywordInput}
                                        onChange={(e) => setKeywordInput(e.target.value)}
                                        onKeyDown={handleKeywordKeyDown}
                                        placeholder={t('admin.generalSettings.addKeyword')}
                                        className="flex-grow bg-transparent focus:outline-none text-white p-1"
                                    />
                               </div>
                            </div>
                        </div>
                        
                        {/* Social Sharing Section */}
                        <div className="space-y-6 bg-gray-700/30 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg text-indigo-400">{t('admin.seo.socialSharingTitle')}</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">{t('admin.seo.ogImage')}</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-32 h-16 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600">
                                        {ogImage ? <img src={ogImage} alt="OG Image Preview" className="w-full h-full object-cover" /> : <ImageIcon size={32} className="text-gray-500"/>}
                                    </div>
                                    <label htmlFor="og-image-upload" className="cursor-pointer bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg text-sm">
                                        {t('admin.generalSettings.changeImage')}
                                    </label>
                                    <input id="og-image-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange(setOgImage)} />
                                     {ogImage && (
                                        <button onClick={() => setOgImage(null)} className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg" title={t('admin.generalSettings.removeImage')}>
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">{t('admin.seo.ogImageDesc')}</p>
                            </div>
                        </div>

                        {/* Indexing Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-700/30 p-4 rounded-lg">
                                <label htmlFor="robots-txt" className="block text-sm font-medium text-gray-300 mb-2">{t('admin.seo.robotsTxt')}</label>
                                <textarea id="robots-txt" value={robotsTxt} onChange={e => setRobotsTxt(e.target.value)} rows={10} className="w-full bg-gray-900 border border-gray-600 rounded-lg py-2 px-3 text-white font-mono text-xs"></textarea>
                            </div>
                             <div className="bg-gray-700/30 p-4 rounded-lg">
                                <label htmlFor="sitemap-xml" className="block text-sm font-medium text-gray-300 mb-2">{t('admin.seo.sitemapXml')}</label>
                                <textarea id="sitemap-xml" value={sitemapXml} onChange={e => setSitemapXml(e.target.value)} rows={10} className="w-full bg-gray-900 border border-gray-600 rounded-lg py-2 px-3 text-white font-mono text-xs"></textarea>
                            </div>
                        </div>

                        {/* Structured Data */}
                        <div className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg">
                            <div>
                                <label htmlFor="structured-data-toggle" className="font-medium text-white">{t('admin.seo.structuredData')}</label>
                                <p className="text-xs text-gray-400">{t('admin.seo.structuredDataDesc')}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" id="structured-data-toggle" className="sr-only peer" checked={enableStructuredData} onChange={() => setEnableStructuredData(!enableStructuredData)} />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                        
                        <button onClick={handleSaveSeoSettings} disabled={isSaving} className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                           {isSaving ? <><LoaderCircle className="animate-spin" size={18} /><span>{t('admin.generalSettings.saving')}</span></> : <><Save size={18} /><span>{t('admin.seo.saveSeoSettings')}</span></>}
                        </button>
                    </div>
                );
            case 'ads':
                return (
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Megaphone size={20} /><span>{t('admin.adManagement.title')}</span></h2>
                        <div className="space-y-6">
                            {adConfigs.map((ad, index) => (
                                <div key={ad.id} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                                    <h3 className="font-bold text-lg text-indigo-400 mb-3 font-mono">{ad.id}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="md:col-span-3">
                                            <label className="block text-sm font-medium text-gray-300 mb-2">{t('admin.adManagement.unitId')}</label>
                                            <input 
                                                type="text" 
                                                value={ad.unitId}
                                                onChange={(e) => handleAdConfigChange(index, 'unitId', e.target.value)}
                                                placeholder="e.g., 1234567890" 
                                                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white font-mono"/>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">{t('admin.adManagement.width')}</label>
                                            <input 
                                                type="text" 
                                                value={ad.width}
                                                onChange={(e) => handleAdConfigChange(index, 'width', e.target.value)}
                                                placeholder="e.g., 100%" 
                                                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white"/>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">{t('admin.adManagement.height')}</label>
                                            <input 
                                                type="text" 
                                                value={ad.height}
                                                onChange={(e) => handleAdConfigChange(index, 'height', e.target.value)}
                                                placeholder="e.g., 96px" 
                                                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white"/>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                         <button onClick={handleSaveAdSettings} disabled={isSaving} className="mt-6 w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                           {isSaving ? <><LoaderCircle className="animate-spin" size={18} /><span>{t('admin.generalSettings.saving')}</span></> : <><Save size={18} /><span>{t('admin.adManagement.saveAdSettings')}</span></>}
                        </button>
                    </div>
                );
            case 'subscriptions':
                 return (
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 space-y-8">
                        <h2 className="text-xl font-bold flex items-center gap-2"><CreditCard size={20} /><span>{t('admin.subscriptionsManagement.title')}</span></h2>
                        
                        {/* Subscription Plans */}
                        <div>
                            <h3 className="font-semibold text-lg text-indigo-400 mb-4">{t('admin.subscriptionsManagement.plansTitle')}</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {subscriptionSettings.plans.map((plan, planIndex) => (
                                    <div key={plan.id} className="bg-gray-700/30 p-4 rounded-lg space-y-4">
                                        <div className="flex items-center justify-between">
                                            <input type="text" value={plan.name} onChange={e => handlePlanChange(planIndex, 'name', e.target.value)} className="w-full text-lg font-bold bg-transparent text-white focus:outline-none focus:bg-gray-700 rounded px-2 py-1"/>
                                            <div className="flex items-center gap-2">
                                                <label htmlFor={`popular-${plan.id}`} title={t('admin.subscriptionsManagement.markPopular')} className="cursor-pointer text-gray-400 hover:text-yellow-400">
                                                    <input type="radio" name="isPopular" id={`popular-${plan.id}`} checked={plan.isPopular} onChange={e => handlePlanChange(planIndex, 'isPopular', e.target.checked)} className="sr-only peer"/>
                                                    <svg className={`w-5 h-5 transition-colors ${plan.isPopular ? 'text-yellow-400' : ''}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                                </label>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" checked={plan.enabled} onChange={e => handlePlanChange(planIndex, 'enabled', e.target.checked)} className="sr-only peer" />
                                                    <div className="w-9 h-5 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                                                </label>
                                            </div>
                                        </div>

                                        <input type="text" value={plan.price} onChange={e => handlePlanChange(planIndex, 'price', e.target.value)} placeholder={t('admin.subscriptionsManagement.price')} className="w-full bg-gray-700 border border-gray-600 rounded py-1 px-2 text-white"/>
                                        <textarea value={plan.description} onChange={e => handlePlanChange(planIndex, 'description', e.target.value)} rows={2} placeholder={t('admin.subscriptionsManagement.description')} className="w-full bg-gray-700 border border-gray-600 rounded py-1 px-2 text-white text-sm"/>
                                        
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">{t('admin.subscriptionsManagement.features')}</label>
                                            {plan.features.map((feature, featureIndex) => (
                                                <div key={featureIndex} className="flex items-center gap-2">
                                                    <input type="text" value={feature} onChange={e => handleFeatureChange(planIndex, featureIndex, e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded py-1 px-2 text-white text-xs"/>
                                                    <button onClick={() => removeFeature(planIndex, featureIndex)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                                                </div>
                                            ))}
                                            <button onClick={() => addFeature(planIndex)} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"><PlusCircle size={14}/> {t('admin.subscriptionsManagement.addFeature')}</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Gateways */}
                        <div>
                            <h3 className="font-semibold text-lg text-indigo-400 mb-4">{t('admin.subscriptionsManagement.gatewaysTitle')}</h3>
                            <div className="space-y-4">
                                {subscriptionSettings.paymentGateways.map((gateway, gatewayIndex) => (
                                    <div key={gateway.id} className="bg-gray-700/30 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="font-semibold text-white">{gateway.name}</div>
                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                            <input 
                                                type="text" 
                                                value={gateway.apiKey} 
                                                onChange={e => handleGatewayChange(gatewayIndex, 'apiKey', e.target.value)} 
                                                placeholder={t('admin.subscriptionsManagement.apiKey')} 
                                                className="w-full bg-gray-700 border border-gray-600 rounded py-1 px-2 text-white text-sm font-mono"
                                            />
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" checked={gateway.enabled} onChange={e => handleGatewayChange(gatewayIndex, 'enabled', e.target.checked)} className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button onClick={handleSaveSubscriptions} disabled={isSaving} className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                           {isSaving ? <><LoaderCircle className="animate-spin" size={18} /><span>{t('admin.generalSettings.saving')}</span></> : <><Save size={18} /><span>{t('admin.subscriptionsManagement.saveButton')}</span></>}
                        </button>
                    </div>
                 );
            case 'pages':
                return (
                     <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><BookOpen size={20} /><span>{t('admin.pageManagement.title')}</span></h2>
                        <div className="mb-4">
                            <select value={selectedPage} onChange={e => setSelectedPage(e.target.value as any)} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white">
                                <option value="about">{t('admin.pageManagement.about')}</option>
                                <option value="privacy">{t('admin.pageManagement.privacy')}</option>
                                <option value="contact">{t('admin.pageManagement.contact')}</option>
                            </select>
                        </div>

                        {selectedPage === 'contact' ? (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-indigo-400 flex items-center gap-2"><Mail size={18} /><span>{t('admin.pageManagement.contactTitle')}</span></h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">{t('admin.pageManagement.mainTitle')}</label>
                                    <input type="text" value={contactInfo.title} onChange={e => handleContactInfoChange('title', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">{t('admin.pageManagement.subtitle')}</label>
                                    <textarea value={contactInfo.subtitle} onChange={e => handleContactInfoChange('subtitle', e.target.value)} rows={3} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white"></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">{t('admin.pageManagement.address')}</label>
                                    <input type="text" value={contactInfo.address} onChange={e => handleContactInfoChange('address', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">{t('admin.pageManagement.email')}</label>
                                    <input type="email" value={contactInfo.email} onChange={e => handleContactInfoChange('email', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white"/>
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">{t('admin.pageManagement.phone')}</label>
                                    <input type="tel" value={contactInfo.phone} onChange={e => handleContactInfoChange('phone', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white"/>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="bg-gray-700 border border-gray-600 rounded-t-lg p-2 flex items-center space-x-2 space-x-reverse">
                                    <button title="Bold" onClick={() => handleTextFormat('bold')} className="p-2 rounded hover:bg-gray-600 text-gray-300 hover:text-white"><Bold size={18} /></button>
                                    <button title="Italic" onClick={() => handleTextFormat('italic')} className="p-2 rounded hover:bg-gray-600 text-gray-300 hover:text-white"><Italic size={18} /></button>
                                    <button title="Unordered List" onClick={() => handleTextFormat('ul')} className="p-2 rounded hover:bg-gray-600 text-gray-300 hover:text-white"><List size={18} /></button>
                                    <button title="Ordered List" onClick={() => handleTextFormat('ol')} className="p-2 rounded hover:bg-gray-600 text-gray-300 hover:text-white"><ListOrdered size={18} /></button>
                                </div>
                                <textarea 
                                    ref={textareaRef}
                                    value={textContent} 
                                    onChange={e => setTextContent(e.target.value)} 
                                    rows={12} 
                                    className="w-full bg-gray-900 border border-gray-600 rounded-b-lg py-2 px-3 text-white font-mono focus:ring-0 focus:outline-none focus:border-gray-500"
                                ></textarea>
                            </>
                        )}
                         <button onClick={handleSavePageContent} disabled={isSaving} className="mt-6 w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                           {isSaving ? <><LoaderCircle className="animate-spin" size={18} /><span>{t('admin.generalSettings.saving')}</span></> : <><Save size={18} /><span>{t('admin.pageManagement.saveContent')}</span></>}
                        </button>
                    </div>
                );
            default: return null;
        }
    }

    const getTabClass = (tabName: string) => `px-4 py-2 font-bold rounded-lg transition-colors flex items-center gap-2 ${activeTab === tabName ? 'bg-indigo-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`;

    return (
        <div className="w-full max-w-7xl space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white">{t('admin.title')}</h1>
                <p className="text-gray-400 mt-1">{t('admin.subtitle')}</p>
            </header>

            <div className="flex flex-wrap gap-2 border-b border-gray-700 pb-2 mb-6">
                <button className={getTabClass('general')} onClick={() => setActiveTab('general')}><Settings size={18} />{t('admin.tabGeneral')}</button>
                <button className={getTabClass('seo')} onClick={() => setActiveTab('seo')}><TrendingUp size={18} />{t('admin.tabSeo')}</button>
                <button className={getTabClass('subscriptions')} onClick={() => setActiveTab('subscriptions')}><CreditCard size={18} />{t('admin.tabSubscriptions')}</button>
                <button className={getTabClass('ads')} onClick={() => setActiveTab('ads')}><Megaphone size={18} />{t('admin.tabAds')}</button>
                <button className={getTabClass('pages')} onClick={() => setActiveTab('pages')}><BookOpen size={18} />{t('admin.tabPages')}</button>
            </div>

            <div>{renderTabContent()}</div>

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
};

export default AdminDashboard;