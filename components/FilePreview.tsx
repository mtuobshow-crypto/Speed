
import React, { useState, useEffect } from 'react';
import { FileText, ImageIcon, File as FileIcon, VideoIcon, Music, X } from 'lucide-react';
import { UploadedFile } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';

interface FilePreviewProps {
  uploadedFile: UploadedFile;
  onMetadataChange: (fileName: string, metadata: Partial<Omit<UploadedFile, 'file'>>) => void;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت', 'تيرابايت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const FilePreview: React.FC<FilePreviewProps> = ({ uploadedFile, onMetadataChange }) => {
  const { file, title, description, keywords } = uploadedFile;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const { t } = useLocalization();

  useEffect(() => {
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('audio/'))) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [file]);

  const renderIcon = () => {
    if (file.type.startsWith('image/')) return <ImageIcon className="w-8 h-8 text-indigo-400" />;
    if (file.type.startsWith('video/')) return <VideoIcon className="w-8 h-8 text-purple-400" />;
    if (file.type.startsWith('audio/')) return <Music className="w-8 h-8 text-cyan-400" />;
    if (file.type === 'application/pdf') return <FileText className="w-8 h-8 text-red-400" />;
    return <FileIcon className="w-8 h-8 text-gray-400" />;
  };
  
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !keywords.includes(newTag)) {
        onMetadataChange(file.name, { keywords: [...keywords, newTag] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onMetadataChange(file.name, { keywords: keywords.filter(tag => tag !== tagToRemove) });
  };


  return (
    <div className="space-y-4 bg-gray-900/50 p-4 rounded-lg">
      {previewUrl && (
        <div className="w-full max-h-48 flex items-center justify-center bg-gray-800 rounded-lg overflow-hidden">
          {file.type.startsWith('image/') && <img src={previewUrl} alt={file.name} className="max-h-48 object-contain" />}
          {file.type.startsWith('video/') && <video src={previewUrl} className="max-h-48" controls muted playsInline />}
          {file.type.startsWith('audio/') && <audio src={previewUrl} controls className="w-full" />}
        </div>
      )}
      <div className="bg-gray-700/50 p-4 rounded-lg flex items-center space-x-4 space-x-reverse">
        <div className="flex-shrink-0 bg-gray-800 w-16 h-16 rounded-lg flex items-center justify-center">
          {renderIcon()}
        </div>
        <div className="flex-grow overflow-hidden">
          <p className="text-sm font-medium text-white truncate">{file.name}</p>
          <p className="text-xs text-gray-400">{formatBytes(file.size)}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor={`fileTitle-${file.name}`} className="block text-sm font-medium text-gray-300 mb-1">{t('filePreview.title')}</label>
          <input 
            type="text" 
            id={`fileTitle-${file.name}`}
            value={title}
            onChange={(e) => onMetadataChange(file.name, { title: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
         <div>
          <label htmlFor={`fileDescription-${file.name}`} className="block text-sm font-medium text-gray-300 mb-1">{t('filePreview.description')}</label>
          <textarea 
            id={`fileDescription-${file.name}`}
            rows={3}
            value={description}
            onChange={(e) => onMetadataChange(file.name, { description: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>
        <div>
           <label htmlFor={`fileKeywords-${file.name}`} className="block text-sm font-medium text-gray-300 mb-1">{t('filePreview.keywords')}</label>
           <div className="bg-gray-700 border border-gray-600 rounded-lg p-2 flex flex-wrap gap-2 items-center">
                {keywords.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 bg-indigo-600 text-white text-sm font-medium px-2 py-1 rounded">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="text-indigo-200 hover:text-white">
                            <X size={14} />
                        </button>
                    </span>
                ))}
                <input 
                    type="text" 
                    id={`fileKeywords-${file.name}`}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder={t('filePreview.keywordsPlaceholder')}
                    className="flex-grow bg-transparent focus:outline-none text-white p-1"
                />
           </div>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
