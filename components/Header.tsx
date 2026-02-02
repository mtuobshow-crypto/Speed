import React, { useState } from 'react';
import { Upload, User, Star, LogOut, LayoutDashboard, LogIn, Menu, X } from 'lucide-react';
import { UserRole, Page } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';

interface HeaderProps {
    onNavigate: (page: Page) => void;
    currentPage: Page;
    currentUser: UserRole;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage, currentUser, onLogout }) => {
    const { t } = useLocalization();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinkClasses = "flex items-center space-x-2 rtl:space-x-reverse text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium";
    const activeLinkClasses = "bg-gray-700 text-white";
    
    const mobileNavLinkClasses = "flex items-center space-x-2 rtl:space-x-reverse text-gray-300 hover:text-white transition-colors p-3 rounded-md text-base font-medium w-full text-right";
    const mobileActiveLinkClasses = "bg-gray-900 text-white";

    const handleMobileLinkClick = (page: Page) => {
        onNavigate(page);
        setIsMobileMenuOpen(false);
    };

    const handleMobileLogoutClick = () => {
        onLogout();
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 fixed top-0 left-0 right-0 z-10">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 cursor-pointer" onClick={() => onNavigate('upload')}>
                            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">{t('header.title')}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {/* Desktop Menu */}
                        <div className="hidden sm:flex items-center space-x-1 rtl:space-x-reverse">
                            {currentUser ? (
                                <>
                                    {currentUser === 'admin' && (
                                        <button
                                            onClick={() => onNavigate('adminDashboard')}
                                            className={`${navLinkClasses} ${currentPage === 'adminDashboard' ? activeLinkClasses : ''}`}
                                        >
                                            <LayoutDashboard size={18}/>
                                            <span>{t('header.dashboard')}</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onNavigate('upload')}
                                        className={`${navLinkClasses} ${currentPage === 'upload' ? activeLinkClasses : ''}`}
                                    >
                                        <Upload size={18}/>
                                        <span>{t('header.uploadFile')}</span>
                                    </button>
                                    <button
                                        onClick={() => onNavigate('profile')}
                                        className={`${navLinkClasses} ${currentPage === 'profile' ? activeLinkClasses : ''}`}
                                    >
                                        <User size={18}/>
                                        <span>{t('header.myProfile')}</span>
                                    </button>
                                    <button
                                        onClick={() => onNavigate('plans')}
                                        className={`${navLinkClasses} ${currentPage === 'plans' ? activeLinkClasses : ''}`}
                                    >
                                        <Star size={18}/>
                                        <span>{t('header.subscriptions')}</span>
                                    </button>
                                    <button
                                        onClick={onLogout}
                                        className={navLinkClasses}
                                    >
                                        <LogOut size={18}/>
                                        <span>{t('header.logout')}</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => onNavigate('plans')}
                                        className={`${navLinkClasses} ${currentPage === 'plans' ? activeLinkClasses : ''}`}
                                    >
                                        <Star size={18}/>
                                        <span>{t('header.subscriptions')}</span>
                                    </button>
                                    <button
                                        onClick={() => onNavigate('login')}
                                        className={`${navLinkClasses} ${currentPage === 'login' ? activeLinkClasses : ''}`}
                                    >
                                        <LogIn size={18}/>
                                        <span>{t('header.login')}</span>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="sm:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMobileMenuOpen ? (
                                    <X className="block h-6 w-6" aria-hidden="true" />
                                ) : (
                                    <Menu className="block h-6 w-6" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="sm:hidden bg-gray-800/95 backdrop-blur-sm border-b border-gray-700">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {currentUser ? (
                            <>
                                {currentUser === 'admin' && (
                                    <button
                                        onClick={() => handleMobileLinkClick('adminDashboard')}
                                        className={`${mobileNavLinkClasses} ${currentPage === 'adminDashboard' ? mobileActiveLinkClasses : ''}`}
                                    >
                                        <LayoutDashboard size={18}/>
                                        <span>{t('header.dashboard')}</span>
                                    </button>
                                )}
                                <button
                                    onClick={() => handleMobileLinkClick('upload')}
                                    className={`${mobileNavLinkClasses} ${currentPage === 'upload' ? mobileActiveLinkClasses : ''}`}
                                >
                                    <Upload size={18}/>
                                    <span>{t('header.uploadFile')}</span>
                                </button>
                                <button
                                    onClick={() => handleMobileLinkClick('profile')}
                                    className={`${mobileNavLinkClasses} ${currentPage === 'profile' ? mobileActiveLinkClasses : ''}`}
                                >
                                    <User size={18}/>
                                    <span>{t('header.myProfile')}</span>
                                </button>
                                <button
                                    onClick={() => handleMobileLinkClick('plans')}
                                    className={`${mobileNavLinkClasses} ${currentPage === 'plans' ? mobileActiveLinkClasses : ''}`}
                                >
                                    <Star size={18}/>
                                    <span>{t('header.subscriptions')}</span>
                                </button>
                                <button
                                    onClick={handleMobileLogoutClick}
                                    className={mobileNavLinkClasses}
                                >
                                    <LogOut size={18}/>
                                    <span>{t('header.logout')}</span>
                                </button>
                            </>
                        ) : (
                             <>
                                <button
                                    onClick={() => handleMobileLinkClick('plans')}
                                    className={`${mobileNavLinkClasses} ${currentPage === 'plans' ? mobileActiveLinkClasses : ''}`}
                                >
                                    <Star size={18}/>
                                    <span>{t('header.subscriptions')}</span>
                                </button>
                                <button
                                    onClick={() => handleMobileLinkClick('login')}
                                    className={`${mobileNavLinkClasses} ${currentPage === 'login' ? mobileActiveLinkClasses : ''}`}
                                >
                                    <LogIn size={18}/>
                                    <span>{t('header.login')}</span>
                                </button>
                             </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
