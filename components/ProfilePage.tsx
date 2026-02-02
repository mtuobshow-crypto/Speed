
import React, { useState, Suspense, lazy, useRef, useEffect } from 'react';
import { 
    File as FileIcon, 
    Download, 
    DollarSign, 
    User, 
    ArrowUpCircle, 
    FileText, 
    FileArchive, 
    PenTool,
    Video,
    Image,
    MoreVertical,
    Pen,
    Check,
    X,
    Music,
    Camera,
    Edit,
    Trash2
} from 'lucide-react';
import { Page } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';

const AdUnit = lazy(() => import('./AdUnit'));

interface ProfilePageProps {
    onNavigate: (page: Page) => void;
    subscribedPlanName: string | null;
    isAdmin: boolean;
}

interface FileData {
    id: string;
    name: string;
    title: string;
    description: string;
    keywords: string[];
    size: string;
    downloads: number;
}


const StatCard: React.FC<{icon: React.ReactNode, label: string, value: string}> = ({icon, label, value}) => (
    <div className="bg-gray-700/50 p-4 rounded-lg flex items-center space-x-4 space-x-reverse">
        <div className="bg-gray-800 p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const initialFiles: FileData[] = [
    { id: 'f1', name: 'project-design.fig', title: 'Project Design', description: 'Main design file for the new company branding project.', keywords: ['design', 'figma', 'branding'], size: '15.2 MB', downloads: 1045 },
    { id: 'f2', name: 'quarterly-report.pdf', title: 'Quarterly Report Q2', description: 'Financial and performance report for the second quarter.', keywords: ['finance', 'report', 'pdf'], size: '2.1 MB', downloads: 782 },
    { id: 'f3', name: 'website-backup.zip', title: 'Website Backup', description: 'Full backup of the main website from July.', keywords: ['backup', 'archive'], size: '128.4 MB', downloads: 150 },
    { id: 'f4', name: 'upbeat-track.mp3', title: 'Upbeat Background Track', description: 'An energetic and positive audio track for video intros.', keywords: ['audio', 'music'], size: '3.5 MB', downloads: 5210 },
    { id: 'f5', name: 'onboarding-video.mp4', title: 'New Employee Onboarding', description: 'Welcome video for new hires, explaining company culture.', keywords: ['video', 'hr', 'onboarding'], size: '45.8 MB', downloads: 530 },
    { id: 'f6', name: 'marketing-banner.jpg', title: 'Summer Sale Banner', description: 'High-resolution banner for the upcoming summer sale campaign.', keywords: ['marketing', 'image', 'sale'], size: '1.2 MB', downloads: 3102 },
];

const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'pdf': return <FileText className="w-12 h-12 text-red-400" />;
        case 'zip': return <FileArchive className="w-12 h-12 text-yellow-400" />;
        case 'fig': return <PenTool className="w-12 h-12 text-purple-400" />;
        case 'sketch': return <PenTool className="w-12 h-12 text-orange-400" />;
        case 'mp4': return <Video className="w-12 h-12 text-teal-400" />;
        case 'jpg': case 'jpeg': case 'png': return <Image className="w-12 h-12 text-blue-400" />;
        case 'mp3': case 'wav': case 'ogg': return <Music className="w-12 h-12 text-cyan-400" />;
        default: return <FileIcon className="w-12 h-12 text-gray-500" />;
    }
};

const FileCard: React.FC<{
    file: FileData;
    onUpdate: (id: string, data: Partial<Omit<FileData, 'id' | 'name' | 'size' | 'downloads'>>) => void;
    onDelete: (id: string) => void;
}> = ({ file, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { t } = useLocalization();

    const [title, setTitle] = useState(file.title);
    const [description, setDescription] = useState(file.description);
    const [keywords, setKeywords] = useState([...file.keywords]);
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const handleSave = () => {
        onUpdate(file.id, { title, description, keywords });
        setIsEditing(false);
        setIsMenuOpen(false);
    };

    const handleCancel = () => {
        setTitle(file.title);
        setDescription(file.description);
        setKeywords([...file.keywords]);
        setIsEditing(false);
        setIsMenuOpen(false);
    };

    const handleDelete = () => {
        if (window.confirm(t('profilePage.deleteConfirm'))) {
            onDelete(file.id);
        }
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !keywords.includes(newTag)) {
                setKeywords([...keywords, newTag]);
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setKeywords(keywords.filter(tag => tag !== tagToRemove));
    };

    if (isEditing) {
        return (
            <div className="bg-gray-800 border border-indigo-500 rounded-xl p-4 flex flex-col space-y-3">
                <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-white font-semibold"
                />
                 <textarea 
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-white text-sm"
                ></textarea>
                <div className="bg-gray-700 border border-gray-600 rounded-md p-2 flex flex-wrap gap-2 items-center">
                    {keywords.map((tag) => (
                        <span key={tag} className="flex items-center gap-1 bg-indigo-600 text-white text-xs font-medium px-2 py-1 rounded">
                            {tag}
                            <button onClick={() => removeTag(tag)} className="text-indigo-200 hover:text-white"><X size={12} /></button>
                        </span>
                    ))}
                    <input 
                        type="text" 
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        placeholder="..."
                        className="flex-grow bg-transparent focus:outline-none text-white text-sm p-1"
                    />
                </div>
                 <div className="flex justify-end items-center gap-2 mt-2">
                    <button onClick={handleCancel} className="p-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white"><X size={16} /></button>
                    <button onClick={handleSave} className="p-2 rounded-md bg-green-600 hover:bg-green-700 text-white"><Check size={16} /></button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-col items-center text-center transition-all duration-300 hover:border-gray-600 hover:-translate-y-1 relative group">
            <div className="absolute top-2 right-2" ref={menuRef}>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                    <MoreVertical size={18} />
                </button>
                {isMenuOpen && (
                    <div className="absolute left-0 mt-2 w-32 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-10">
                        <button 
                            onClick={() => { setIsEditing(true); setIsMenuOpen(false); }}
                            className="w-full text-right flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
                        >
                            <Edit size={14} />
                            <span>{t('profilePage.edit')}</span>
                        </button>
                        <button 
                            onClick={handleDelete}
                            className="w-full text-right flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-900/40"
                        >
                            <Trash2 size={14} />
                            <span>{t('profilePage.delete')}</span>
                        </button>
                    </div>
                )}
            </div>
            <div className="mb-4">{getFileIcon(file.name)}</div>
            <p className="w-full text-sm font-medium text-white truncate mb-2" title={file.title}>
                {file.title}
            </p>
            <div className="w-full flex flex-col items-center gap-2 text-xs text-gray-400 sm:flex-row sm:justify-between sm:gap-0">
                <span>{file.size}</span>
                <span className="flex items-center gap-1">
                    <Download size={12} />
                    {file.downloads.toLocaleString()}
                </span>
            </div>
        </div>
    );
};

const AdPlaceholder: React.FC<{ height: string, className?: string }> = ({ height, className = '' }) => {
    const { t } = useLocalization();
    return (
        <div
            style={{ height }}
            className={`bg-gray-700/50 border border-dashed border-gray-500 rounded-lg flex items-center justify-center text-gray-500 ${className}`}
        >
            <p className="text-sm">{t('adUnit.loading')}</p>
        </div>
    );
};

const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate, subscribedPlanName, isAdmin }) => {
    const [userName, setUserName] = useState('عبد الله');
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempUserName, setTempUserName] = useState(userName);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<FileData[]>(initialFiles);
    const { t } = useLocalization();

    const planKey = subscribedPlanName ? 'pro' : 'free';
    const planText = t(`profilePage.plan_${planKey}`);
    const planColor = subscribedPlanName ? 'text-indigo-400' : 'text-gray-400';
    
    const totalDownloads = files.reduce((sum, f) => sum + f.downloads, 0);
    const EARNINGS_PER_DOWNLOAD = 0.0085; // Simulated rate: $0.0085 per download
    const estimatedEarnings = totalDownloads * EARNINGS_PER_DOWNLOAD;

    const handleNameEditStart = () => {
        setTempUserName(userName);
        setIsEditingName(true);
    };

    const handleNameEditCancel = () => {
        setIsEditingName(false);
    };

    const handleNameEditSave = () => {
        if (tempUserName.trim()) {
            setUserName(tempUserName.trim());
        }
        setIsEditingName(false);
    };

    const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleNameEditSave();
        if (e.key === 'Escape') handleNameEditCancel();
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            if (avatarUrl) {
                URL.revokeObjectURL(avatarUrl);
            }
            const newUrl = URL.createObjectURL(file);
            setAvatarUrl(newUrl);
        }
    };
    
    const handleUpdateFileMetadata = (id: string, data: Partial<Omit<FileData, 'id' | 'name' | 'size' | 'downloads'>>) => {
        setFiles(currentFiles => 
            currentFiles.map(file => 
                file.id === id ? { ...file, ...data } : file
            )
        );
    };

    const handleDeleteFile = (idToDelete: string) => {
        setFiles(currentFiles => currentFiles.filter(file => file.id !== idToDelete));
    };

    return (
        <div className="w-full max-w-5xl space-y-8">
            <header className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="relative group">
                        <button
                            onClick={handleAvatarClick}
                            className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
                            aria-label={t('profilePage.changeAvatar')}
                        >
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-10 h-10 text-white"/>
                            )}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                    <div>
                        {isEditingName ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={tempUserName}
                                    onChange={(e) => setTempUserName(e.target.value)}
                                    onKeyDown={handleNameKeyDown}
                                    className="bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-3xl font-bold text-white w-60"
                                    autoFocus
                                    aria-label={t('profilePage.editName')}
                                />
                                <button onClick={handleNameEditSave} className="p-2 rounded-md bg-green-600 hover:bg-green-700 text-white" aria-label={t('profilePage.saveName')}>
                                    <Check size={20} />
                                </button>
                                <button onClick={handleNameEditCancel} className="p-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white" aria-label={t('profilePage.cancelEdit')}>
                                    <X size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 group cursor-pointer" onClick={handleNameEditStart}>
                                <h1 className="text-3xl font-bold">{t('profilePage.welcome', { name: userName })}</h1>
                                <button className="text-gray-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100" aria-label={t('profilePage.editName')}>
                                    <Pen size={18} />
                                </button>
                            </div>
                        )}
                        <p className="text-gray-400 mt-1">{t('profilePage.planStatus', { plan: '' })}<span className={`font-bold ${planColor}`}>{planText}</span>.</p>
                    </div>
                </div>
                 <button 
                    onClick={() => onNavigate('plans')}
                    className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                    <ArrowUpCircle size={18} />
                    <span>{t('profilePage.upgradePlan')}</span>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard icon={<FileIcon size={22} className="text-indigo-400"/>} label={t('profilePage.totalFiles')} value={files.length.toString()}/>
                <StatCard icon={<Download size={22} className="text-green-400"/>} label={t('profilePage.totalDownloads')} value={totalDownloads.toLocaleString()}/>
                <StatCard icon={<DollarSign size={22} className="text-yellow-400"/>} label={t('profilePage.estimatedEarnings')} value={`$${estimatedEarnings.toFixed(2)}`}/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                     <h2 className="text-xl font-bold mb-4">{t('profilePage.myFiles')}</h2>
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {files.map((file) => (
                             <FileCard key={file.id} file={file} onUpdate={handleUpdateFileMetadata} onDelete={handleDeleteFile} />
                        ))}
                     </div>
                </div>
                 <div className="space-y-4">
                    <h2 className="text-xl font-bold">{t('profilePage.adManager')}</h2>
                    <Suspense fallback={<AdPlaceholder height="256px" />}>
                        <AdUnit id="profile-page-sidebar" isAdmin={isAdmin} defaultHeight="256px" />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
