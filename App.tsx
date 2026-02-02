import React, { useState, useCallback, useEffect, useContext } from 'react';
import FileUpload from './components/FileUpload';
import FilePreview from './components/FilePreview';
import ProgressBar from './components/ProgressBar';
import Header from './components/Header';
import DownloadPage from './components/DownloadPage';
import ProfilePage from './components/ProfilePage';
import PlansPage from './components/PlansPage';
import PaymentHistoryPage from './components/PaymentHistoryPage';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import GenericPage from './components/GenericPage';
import ContactPage from './components/ContactPage';
import Footer from './components/Footer';
import PreDownloadPage from './components/PreDownloadPage';
import { UploadCloud, CheckCircle, X, AlertTriangle } from 'lucide-react';
import { AppSettingsContext } from './contexts/AppSettingsContext';
import { useLocalization } from './contexts/LocalizationContext';
import { Page, UserRole, UploadedFile } from './types';

type UploadStatus = 'idle' | 'selected' | 'uploading' | 'success' | 'error';

interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: string;
}
interface Plan {
    name: string;
    price: string;
    description: string;
    features: string[];
    isPopular?: boolean;
}

// --- SEO Helper Functions ---
const updateMetaTag = (identifier: 'name' | 'property', value: string, content: string) => {
    let element = document.querySelector(`meta[${identifier}='${value}']`) as HTMLMetaElement;
    if (element) {
        element.setAttribute('content', content);
    }
};

const updateCanonicalLink = (href: string) => {
    let element = document.getElementById('canonical-link') as HTMLLinkElement;
    if (element) {
        element.href = href;
    }
}

const updateStructuredData = (data: object | null) => {
    let element = document.getElementById('structured-data') as HTMLScriptElement;
    if (element) {
        element.textContent = data ? JSON.stringify(data, null, 2) : '';
    }
}
// --- End SEO Helper Functions ---

const App: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('upload');
  const [currentUser, setCurrentUser] = useState<UserRole>(null);

  const [subscribedPlan, setSubscribedPlan] = useState<string | null>('احترافي');
  const [paymentHistory, setPaymentHistory] = useState<Transaction[]>([
    { id: 'txn_2', date: '2024-06-15', description: 'اشتراك - الخطة الإحترافية', amount: '$15.00' },
    { id: 'txn_1', date: '2024-07-15', description: 'اشتراك - الخطة الإحترافية', amount: '$15.00' },
  ].reverse());
  
  const { settings, pages } = useContext(AppSettingsContext);
  const { t } = useLocalization();

  // Combined effect for updating general site settings and dynamic page SEO
  useEffect(() => {
    // Update favicon
    const favicon = document.getElementById('favicon') as HTMLLinkElement | null;
    if (favicon) {
        favicon.href = settings.siteIcon || '/vite.svg';
    }

    // Dynamic SEO updates based on current page
    const defaultTitle = settings.siteTitle || 'File Uploader Pro';
    const defaultDescription = settings.siteDescription || '';
    const origin = window.location.origin;
    const defaultOgImage = settings.ogImage ? `${origin}${settings.ogImage}` : null;

    const setSocialImages = () => {
        if (defaultOgImage) {
            updateMetaTag('property', 'og:image', defaultOgImage);
            updateMetaTag('name', 'twitter:image', defaultOgImage);
        }
    };

    const websiteStructuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": defaultTitle,
        "url": origin,
    };

    switch (currentPage) {
        case 'download':
        case 'preDownload':
            const file = files[0];
            if (file) {
                const pageTitle = `${file.title} - ${defaultTitle}`;
                const pageDescription = file.description || defaultDescription;
                const pageKeywords = [...file.keywords, ...settings.siteKeywords].join(', ');
                const pageUrl = window.location.href;

                document.title = pageTitle;
                updateMetaTag('name', 'description', pageDescription);
                updateMetaTag('name', 'keywords', pageKeywords);
                updateCanonicalLink(pageUrl);

                // Open Graph & Twitter
                updateMetaTag('property', 'og:title', file.title);
                updateMetaTag('property', 'og:description', pageDescription);
                updateMetaTag('property', 'og:type', 'article');
                updateMetaTag('property', 'og:url', pageUrl);
                updateMetaTag('name', 'twitter:card', 'summary');
                updateMetaTag('name', 'twitter:title', file.title);
                updateMetaTag('name', 'twitter:description', pageDescription);
                setSocialImages();
                
                // Structured Data for the file
                if (settings.enableStructuredData) {
                    updateStructuredData({
                        "@context": "https://schema.org",
                        "@type": "CreativeWork",
                        "name": file.title,
                        "description": file.description,
                        "keywords": file.keywords.join(', '),
                        "encodingFormat": file.file.type,
                        "author": {
                            "@type": "Person",
                            "name": currentUser ? "Authenticated User" : "Anonymous"
                        }
                    });
                } else {
                    updateStructuredData(null);
                }
            }
            break;

        case 'plans':
        case 'about':
        case 'privacy':
        case 'contact':
            const pageKeyMap: Record<string, string> = {
                plans: 'plansPage.title',
                about: 'footer.aboutUs',
                privacy: 'footer.privacyPolicy',
                contact: 'footer.contactUs',
            };
            const translationKey = pageKeyMap[currentPage];
            const pageTitle = `${t(translationKey)} - ${defaultTitle}`;
            const pageDescription = currentPage === 'plans' ? t('plansPage.subtitle') : defaultDescription;
            
            document.title = pageTitle;
            updateMetaTag('name', 'description', pageDescription);
            updateMetaTag('property', 'og:title', pageTitle);
            updateMetaTag('property', 'og:description', pageDescription);
            setSocialImages();
            
            if (settings.enableStructuredData) {
                updateStructuredData(websiteStructuredData);
            } else {
                updateStructuredData(null);
            }
            break;

        default: // 'upload', 'login', etc.
            document.title = defaultTitle;
            updateMetaTag('name', 'description', defaultDescription);
            updateMetaTag('name', 'keywords', settings.siteKeywords.join(', '));
            updateCanonicalLink(origin);
            
            updateMetaTag('property', 'og:title', defaultTitle);
            updateMetaTag('property', 'og:description', defaultDescription);
            updateMetaTag('property', 'og:type', 'website');
            updateMetaTag('property', 'og:url', origin);

            updateMetaTag('name', 'twitter:card', 'summary');
            updateMetaTag('name', 'twitter:title', defaultTitle);
            updateMetaTag('name', 'twitter:description', defaultDescription);
            setSocialImages();
            
            if (settings.enableStructuredData) {
                updateStructuredData(websiteStructuredData);
            } else {
                updateStructuredData(null);
            }
            break;
    }
  }, [settings, currentPage, files, t, currentUser]);


  // Dynamically load Google AdSense script
  useEffect(() => {
    if (settings.adsensePublisherId) {
        const script = document.createElement('script');
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${settings.adsensePublisherId}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.id = 'adsense-script';
        
        // Avoid adding duplicate scripts
        if (!document.getElementById('adsense-script')) {
            document.head.appendChild(script);
        }

        return () => {
            const existingScript = document.getElementById('adsense-script');
            if (existingScript) {
                document.head.removeChild(existingScript);
            }
        };
    }
  }, [settings.adsensePublisherId]);


  const handleFilesSelect = useCallback((selectedFiles: File[]) => {
    const maxSizeBytes = settings.maxFileSize * 1024 * 1024;

    const oversizedFiles = selectedFiles.filter(f => f.size > maxSizeBytes);
    if (oversizedFiles.length > 0) {
        setError(t('uploadPage.errorSizeLimit', { limit: settings.maxFileSize }));
        setUploadStatus('error');
        return;
    }
    
    const newUploadedFiles: UploadedFile[] = selectedFiles.map(f => {
        const fileNameWithoutExt = f.name.split('.').slice(0, -1).join('.') || f.name;
        return {
            file: f,
            title: fileNameWithoutExt.replace(/[-_]/g, ' '),
            description: '',
            keywords: [],
        };
    });

    setFiles(prevFiles => [...prevFiles, ...newUploadedFiles]);
    setUploadStatus('selected');
    setError(null);
  }, [t, settings.maxFileSize]);

  const handleMetadataChange = useCallback((fileName: string, metadata: Partial<Omit<UploadedFile, 'file'>>) => {
      setFiles(prevFiles =>
        prevFiles.map(f =>
            f.file.name === fileName ? { ...f, ...metadata } : f
        )
    );
  }, []);
  
  const handleReset = useCallback(() => {
    setFiles([]);
    setUploadProgress(0);
    setUploadStatus('idle');
    setError(null);
    setCurrentPage('upload');
  }, []);

  const handleUpload = useCallback(() => {
    if (files.length === 0) return;

    setUploadStatus('uploading');
    setUploadProgress(0);

    // Simulate a more realistic progress update
    const totalSize = files.reduce((acc, f) => acc + f.file.size, 0);
    let uploadedSize = 0;

    const interval = setInterval(() => {
      uploadedSize += totalSize / (files.length * 5); // Simulating upload in 5 steps per file
      const currentProgress = Math.min(100, (uploadedSize / totalSize) * 100);

      setUploadProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setUploadStatus('success');
        if (files.length === 1) {
            setTimeout(() => setCurrentPage('preDownload'), 1500);
        } else {
            setTimeout(handleReset, 2500);
        }
      }
    }, 200);
  }, [files, handleReset]);

  const handlePreDownloadEnd = useCallback(() => {
    setCurrentPage('download');
  }, []);

  const handlePaymentSuccess = useCallback((plan: Plan) => {
    const newTransaction: Transaction = {
        id: `txn_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        description: t('paymentHistory.transactionDescription', { planName: plan.name }),
        amount: plan.price,
    };
    setPaymentHistory(prev => [newTransaction, ...prev]);
    setSubscribedPlan(plan.name);
  }, [t]);

  const handleLogin = (role: UserRole) => {
    setCurrentUser(role);
    if (role === 'admin') {
      setCurrentPage('adminDashboard');
    } else {
      setCurrentPage('upload');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('upload');
    handleReset();
  };

  const renderUploaderContent = () => {
    switch (uploadStatus) {
      case 'idle':
        return <FileUpload onFilesSelect={handleFilesSelect} />;
      case 'error':
        return (
          <div className="text-center flex flex-col items-center justify-center bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">{t('uploadPage.errorTitle')}</h3>
            <p className="text-red-300 mb-6">{error}</p>
            <button
              onClick={handleReset}
              className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors duration-300"
            >
              {t('uploadPage.tryAgain')}
            </button>
          </div>
        );
      case 'selected':
        const plural = files.length === 1 ? t('uploadPage.file_one') : t('uploadPage.file_other');
        return (
          <div>
            {files.length > 1 && (
                <div className="flex justify-end mb-4">
                    <button
                        onClick={handleReset}
                        className="text-sm text-red-400 hover:text-red-300 bg-red-900/30 px-3 py-1 rounded-md transition-colors"
                    >
                        {t('uploadPage.clearAll')}
                    </button>
                </div>
            )}
            <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                 {files.map((f) => (
                    <FilePreview key={f.file.name + f.file.lastModified} uploadedFile={f} onMetadataChange={handleMetadataChange} />
                ))}
            </div>
            <button
              onClick={handleUpload}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 mt-6"
            >
              <UploadCloud size={20} />
              <span>{t('uploadPage.uploadBtn', { count: files.length, plural: plural })}</span>
            </button>
          </div>
        );
      case 'uploading':
        const pluralUploading = files.length === 1 ? t('uploadPage.file_one') : t('uploadPage.file_other');
        return (
           <div>
            <p className="text-center text-indigo-300 mb-2">{t('uploadPage.uploadingStatus', { count: files.length, plural: pluralUploading })}</p>
            <ProgressBar progress={uploadProgress} />
          </div>
        );
      case 'success':
        return (
          <div className="text-center flex flex-col items-center">
             <CheckCircle className="text-green-400 w-16 h-16 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{t('uploadPage.successTitle')}</h3>
             {files.length === 1 ? (
                <p className="text-gray-400">{t('uploadPage.successMsgSingle')}</p>
            ) : (
                <p className="text-gray-400">{t('uploadPage.successMsgMultiple', { count: files.length })}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };
  
  const renderPage = () => {
    const protectedPages: Page[] = ['profile', 'paymentHistory', 'adminDashboard'];
    if (protectedPages.includes(currentPage) && !currentUser) {
        return <LoginPage onLogin={handleLogin} />;
    }

    switch (currentPage) {
      case 'upload':
        return (
             <div className="w-full max-w-md">
                <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl shadow-indigo-900/20 p-6 md:p-8 relative">
                  {files.length > 0 && uploadStatus !== 'idle' && uploadStatus !== 'success' && (
                    <button onClick={handleReset} className="absolute top-4 left-4 text-gray-500 hover:text-white transition-colors">
                      <X size={20} />
                    </button>
                  )}
                  <header className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                      {settings.siteTitle}
                    </h1>
                    <p className="text-gray-400 mt-2">{t('uploadPage.mainTitle')}</p>
                  </header>
                  <main>
                    {renderUploaderContent()}
                  </main>
                </div>
             </div>
        );
      case 'preDownload':
        return files.length > 0 ? <PreDownloadPage uploadedFile={files[0]} onTimerEnd={handlePreDownloadEnd} isAdmin={currentUser === 'admin'} /> : <p>{t('preDownloadPage.fileNotFound')}</p>;
      case 'download':
        return files.length > 0 ? <DownloadPage uploadedFile={files[0]} onUploadAnother={handleReset} isAdmin={currentUser === 'admin'} /> : <p>{t('preDownloadPage.fileNotFound')}</p>;
      case 'profile':
        return <ProfilePage onNavigate={setCurrentPage} subscribedPlanName={subscribedPlan} isAdmin={currentUser === 'admin'} />;
      case 'plans':
        return <PlansPage 
            subscribedPlan={subscribedPlan}
            onPaymentSuccess={handlePaymentSuccess}
            onNavigate={setCurrentPage}
            currentUser={currentUser}
        />;
      case 'paymentHistory':
        return <PaymentHistoryPage transactions={paymentHistory} onNavigate={setCurrentPage} />;
      case 'adminDashboard':
        return currentUser === 'admin' ? <AdminDashboard /> : <p>{t('general.accessDenied')}</p>;
      case 'about':
        return <GenericPage title={t('footer.aboutUs')} content={pages.about} />;
      case 'privacy':
        return <GenericPage title={t('footer.privacyPolicy')} content={pages.privacy} />;
      case 'contact':
        return <ContactPage />;
      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  }

  let backgroundStyle: React.CSSProperties = {};
  if (currentPage === 'download') {
    const { type, value } = settings.downloadPageBackground;
    if (type === 'image' && value) {
        backgroundStyle = {
            backgroundImage: `url(${value})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        };
    } else {
        backgroundStyle = { backgroundColor: value };
    }
  }


  return (
    <div 
        className={`min-h-screen text-white font-sans flex flex-col transition-colors duration-500 ${currentPage !== 'download' ? 'bg-gray-900' : ''}`} 
        style={backgroundStyle}
    >
        <Header onNavigate={setCurrentPage} currentPage={currentPage} currentUser={currentUser} onLogout={handleLogout} />
        <main className="flex-grow flex items-center justify-center p-4 pt-24 pb-12">
            {renderPage()}
        </main>
        <Footer onNavigate={setCurrentPage} />
    </div>
  );
};

export default App;