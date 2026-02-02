
import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); 

    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-600' : 'bg-red-600';
  const icon = isSuccess ? <CheckCircle size={20} /> : <XCircle size={20} />;

  return (
    <div className={`fixed bottom-5 left-5 z-50 flex items-center gap-4 p-4 rounded-lg shadow-lg text-white ${bgColor} animate-slide-in`}>
      {icon}
      <p className="font-medium">{message}</p>
      <button onClick={onClose} className="ml-auto -mr-2 p-1 rounded-full hover:bg-white/20 transition-colors">
        <X size={18} />
      </button>
    </div>
  );
};

export default Notification;
