import React, { createContext, useState, useEffect, ReactNode } from 'react';

export interface AdConfig {
    id: string;
    unitId: string;
    width: string;
    height: string;
}

export interface Plan {
    id: 'free' | 'pro' | 'enterprise';
    name: string;
    price: string;
    description: string;
    features: string[];
    isPopular: boolean;
    enabled: boolean;
}

export interface PaymentGateway {
    id: 'card' | 'paypal' | 'apple_pay';
    name: string;
    enabled: boolean;
    apiKey?: string;
}

export interface SubscriptionSettings {
    plans: Plan[];
    paymentGateways: PaymentGateway[];
}

const initialRobotsTxt = `# توجيه عناكب البحث للسماح بفهرسة المحتوى العام
User-agent: *

# منع فهرسة الصفحات الخاصة أو غير المهمة
Disallow: /#adminDashboard
Disallow: /#profile
Disallow: /#paymentHistory
Disallow: /#login

# السماح بباقي المحتوى
Allow: /

# هام: قم باستبدال [YOUR_SITE_URL] بعنوان موقعك الفعلي
Sitemap: [YOUR_SITE_URL]/sitemap.xml`;

const initialSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- هام: قم باستبدال كل [YOUR_SITE_URL] بعنوان موقعك الفعلي -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- الصفحة الرئيسية -->
    <url>
        <loc>[YOUR_SITE_URL]/</loc>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <!-- صفحات أخرى هامة -->
    <url>
        <loc>[YOUR_SITE_URL]/#plans</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>[YOUR_SITE_URL]/#about</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>[YOUR_SITE_URL]/#contact</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>[YOUR_SITE_URL]/#privacy</loc>
        <changefreq>yearly</changefreq>
        <priority>0.5</priority>
    </url>
</urlset>`;

interface SiteSettings {
    siteTitle: string;
    siteDescription: string;
    siteKeywords: string[];
    siteIcon: string | null;
    maintenanceMode: boolean;
    countdownDuration: number;
    preDownloadDelay: number;
    maxFileSize: number; // in MB
    downloadPageBackground: {
        type: 'color' | 'image';
        value: string;
    };
    adsensePublisherId: string;
    // SEO Fields
    robotsTxtContent: string;
    sitemapXmlContent: string;
    ogImage: string | null;
    enableStructuredData: boolean;
}

export interface ContactPageContent {
    title: string;
    subtitle: string;
    address: string;
    email: string;
    phone: string;
}

interface PageContent {
    about: string;
    privacy: string;
    contact: ContactPageContent;
}

interface AppSettingsContextType {
    settings: SiteSettings;
    ads: AdConfig[];
    pages: PageContent;
    subscriptions: SubscriptionSettings;
    updateSettings: (newSettings: Partial<SiteSettings>) => void;
    updateAds: (newAds: AdConfig[]) => void;
    updatePageContent: (page: keyof PageContent, content: string | ContactPageContent) => void;
    updateSubscriptions: (newSubscriptions: Partial<SubscriptionSettings>) => void;
}

const SETTINGS_KEY = 'appSettings';

const initialSettings: SiteSettings = {
    siteTitle: 'File Uploader Pro',
    siteDescription: 'A professional file sharing platform with a modern drag-and-drop uploader, user profiles, download pages with countdowns, and simulated ad monetization.',
    siteKeywords: ['file sharing', 'upload', 'download', 'storage', 'cloud'],
    siteIcon: null,
    maintenanceMode: false,
    countdownDuration: 10,
    preDownloadDelay: 5,
    maxFileSize: 100, // Default to 100 MB
    downloadPageBackground: {
        type: 'color',
        value: '#111827' // bg-gray-900
    },
    adsensePublisherId: '',
    // SEO Defaults
    robotsTxtContent: initialRobotsTxt,
    sitemapXmlContent: initialSitemapXml,
    ogImage: null,
    enableStructuredData: true,
};

const initialAds: AdConfig[] = [
    { id: 'download-page-top', unitId: '', width: '100%', height: '96px' },
    { id: 'download-page-middle', unitId: '', width: '100%', height: '250px' },
    { id: 'download-page-bottom', unitId: '', width: '100%', height: '90px' },
    { id: 'pre-download-page', unitId: '', width: '100%', height: '250px' },
    { id: 'profile-page-sidebar', unitId: '', width: '100%', height: '256px' },
];

const initialPages: PageContent = {
    about: '<h1>مرحباً بك في موقعنا</h1><p>هذه هي صفحة "من نحن". قم بتعديل هذا المحتوى من لوحة تحكم المدير.</p>',
    privacy: `<h1>سياسة الخصوصية</h1>
<p>خصوصيتك مهمة جدًا بالنسبة لنا. تهدف سياسة الخصوصية هذه إلى توضيح كيفية جمع واستخدام وحماية المعلومات التي تقدمها عند استخدامك لموقعنا.</p>
<h2>جمع المعلومات</h2>
<p>قد نقوم بجمع معلومات غير شخصية مثل عنوان IP، نوع المتصفح، ومزود خدمة الإنترنت لأغراض التحليل وتحسين الخدمة. لا نقوم بجمع معلومات شخصية تعريفية إلا إذا قمت بتقديمها طواعية (على سبيل المثال، عبر نموذج الاتصال).</p>
<h2>ملفات تعريف الارتباط (Cookies)</h2>
<p>يستخدم موقعنا ملفات تعريف الارتباط لتحسين تجربة المستخدم. ملفات تعريف الارتباط هي ملفات نصية صغيرة يتم تخزينها على جهازك.</p>
<ul>
    <li>نستخدم ملفات تعريف الارتباط الأساسية لضمان عمل الموقع بشكل صحيح.</li>
    <li>قد يستخدم موردو الجهات الخارجية، بما في ذلك Google، ملفات تعريف ارتباط لعرض الإعلانات بناءً على زيارات المستخدم السابقة لموقعنا أو لمواقع أخرى على الويب.</li>
    <li>يمكن لزوارنا إلغاء الاشتراك في الإعلانات المخصصة عن طريق زيارة <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style="color: #818cf8;">إعدادات الإعلانات</a>.</li>
</ul>
<h2>استخدام المعلومات</h2>
<p>تُستخدم المعلومات التي نجمعها لتحسين خدماتنا، وتخصيص تجربتك، وعرض الإعلانات ذات الصلة. نحن لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أطراف ثالثة دون موافقتك، إلا كما يقتضي القانون.</p>
<h2>روابط الطرف الثالث</h2>
<p>قد يحتوي موقعنا على روابط لمواقع أخرى. نحن لسنا مسؤولين عن ممارسات الخصوصية أو محتوى تلك المواقع. نشجعك على قراءة سياسات الخصوصية الخاصة بهم.</p>
<h2>التغييرات على سياسة الخصوصية</h2>
<p>نحتفظ بالحق في تعديل سياسة الخصوصية هذه في أي وقت. سيتم نشر أي تغييرات على هذه الصفحة.</p>
<h2>اتصل بنا</h2>
<p>إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يمكنك الاتصال بنا عبر المعلومات المتوفرة في صفحة "اتصل بنا".</p>`,
    contact: {
        title: 'تواصل معنا',
        subtitle: 'لديك سؤال أو اقتراح؟ يسعدنا أن نسمع منك. املأ النموذج أدناه أو استخدم معلومات الاتصال المباشرة.',
        address: '123 شارع المثال، مدينة الرياض، المملكة العربية السعودية',
        email: 'contact@example.com',
        phone: '(+966) 11 234 5678',
    },
};

const initialSubscriptions: SubscriptionSettings = {
    plans: [
        {
            id: 'free',
            name: "مجاني",
            price: "$0",
            description: "للبدء والمشاريع الشخصية.",
            features: [
                "1 جيجابايت مساحة تخزين",
                "100 تحميل شهرياً",
                "تحليلات أساسية",
                "دعم عبر البريد الإلكتروني"
            ],
            isPopular: false,
            enabled: true,
        },
        {
            id: 'pro',
            name: "احترافي",
            price: "$15",
            description: "للمحترفين والفرق الصغيرة.",
            features: [
                "50 جيجابايت مساحة تخزين",
                "تحميلات غير محدودة",
                "تحليلات متقدمة",
                "دعم ذو أولوية",
                "لا توجد إعلانات"
            ],
            isPopular: true,
            enabled: true,
        },
        {
            id: 'enterprise',
            name: "شركات",
            price: "$50",
            description: "للشركات الكبيرة والمؤسسات.",
            features: [
                "500 جيجابايت مساحة تخزين",
                "تحميلات غير محدودة",
                "أدوات تعاون الفريق",
                "دعم مخصص 24/7",
                "تحكم متقدم بالأمان"
            ],
            isPopular: false,
            enabled: true,
        }
    ],
    paymentGateways: [
        { id: 'card', name: "Credit/Debit Card", enabled: true, apiKey: '' },
        { id: 'paypal', name: "PayPal", enabled: true, apiKey: '' },
        { id: 'apple_pay', name: "Apple Pay", enabled: true, apiKey: '' },
    ]
};


const getInitialState = () => {
    try {
        const storedState = localStorage.getItem(SETTINGS_KEY);
        if (storedState) {
            const parsed = JSON.parse(storedState);
            // Ensure all keys exist, falling back to defaults
            const ads = [...initialAds];
            if (parsed.ads) {
              parsed.ads.forEach((savedAd: AdConfig) => {
                const index = ads.findIndex(ad => ad.id === savedAd.id);
                if (index !== -1) {
                  ads[index] = savedAd;
                } else {
                  ads.push(savedAd);
                }
              });
            }

            return {
                settings: { ...initialSettings, ...parsed.settings },
                ads: ads,
                pages: { 
                    ...initialPages,
                     ...parsed.pages,
                     contact: { ...initialPages.contact, ...(parsed.pages?.contact || {}) }
                },
                subscriptions: { ...initialSubscriptions, ...parsed.subscriptions }
            };
        }
    } catch (e) {
        console.error("Failed to parse settings from localStorage", e);
    }
    return { settings: initialSettings, ads: initialAds, pages: initialPages, subscriptions: initialSubscriptions };
};


export const AppSettingsContext = createContext<AppSettingsContextType>({
    settings: initialSettings,
    ads: initialAds,
    pages: initialPages,
    subscriptions: initialSubscriptions,
    updateSettings: () => {},
    updateAds: () => {},
    updatePageContent: () => {},
    updateSubscriptions: () => {},
});

export const AppSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState(getInitialState());

    useEffect(() => {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(state));
        } catch (e) {
            console.error("Failed to save settings to localStorage", e);
        }
    }, [state]);

    const updateSettings = (newSettings: Partial<SiteSettings>) => {
        setState(prevState => ({
            ...prevState,
            settings: { ...prevState.settings, ...newSettings }
        }));
    };

    const updateAds = (newAds: AdConfig[]) => {
        setState(prevState => ({
            ...prevState,
            ads: newAds
        }));
    };

    const updatePageContent = (page: keyof PageContent, content: string | ContactPageContent) => {
        setState(prevState => ({
            ...prevState,
            pages: { ...prevState.pages, [page]: content }
        }));
    };
    
    const updateSubscriptions = (newSubscriptions: Partial<SubscriptionSettings>) => {
        setState(prevState => ({
            ...prevState,
            subscriptions: { ...prevState.subscriptions, ...newSubscriptions }
        }));
    };

    return (
        <AppSettingsContext.Provider value={{ ...state, updateSettings, updateAds, updatePageContent, updateSubscriptions }}>
            {children}
        </AppSettingsContext.Provider>
    );
};