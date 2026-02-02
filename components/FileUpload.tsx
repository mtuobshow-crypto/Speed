
import React, { useState, useCallback, DragEvent } from 'react';
import { UploadCloud } from 'lucide-react';
import { useLocalization } from '../contexts/LocalizationContext';

interface FileUploadProps {
  onFilesSelect: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const { t } = useLocalization();

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelect(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  }, [onFilesSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelect(Array.from(e.target.files));
    }
  };

  const handleClick = () => {
    document.getElementById('file-input')?.click();
  };
  
  const dropzoneClasses = `flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer ${
    isDragging 
      ? 'border-indigo-500 bg-indigo-500/10 ring-4 ring-indigo-500/20 scale-105' 
      : 'border-gray-600 hover:border-indigo-500 hover:bg-gray-700/30'
  }`;

  return (
    <div>
        <div
          className={dropzoneClasses}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            type="file"
            id="file-input"
            className="hidden"
            onChange={handleFileChange}
            multiple
          />
          <UploadCloud className={`mb-4 transition-all duration-300 ${
            isDragging ? 'w-16 h-16 text-indigo-400' : 'w-12 h-12 text-gray-500'
          }`} />
          {isDragging ? (
            <p className="text-xl font-bold text-indigo-300">{t('uploadPage.dropNow')}</p>
          ) : (
            <>
                <p className="text-center text-gray-300">
                    <span className="font-bold text-indigo-400">{t('uploadPage.dragAndDrop')}</span> {t('uploadPage.filesHere')}
                </p>
                <p className="text-gray-500 mt-1">{t('uploadPage.orClickBrowse')}</p>
            </>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
            {t('uploadPage.legalDisclaimer')}
        </p>
    </div>
  );
};

export default FileUpload;
