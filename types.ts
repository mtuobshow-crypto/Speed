
export type Page = 'login' | 'upload' | 'download' | 'preDownload' | 'profile' | 'plans' | 'paymentHistory' | 'adminDashboard' | 'about' | 'privacy' | 'contact';
export type UserRole = 'admin' | 'user' | null;

export interface UploadedFile {
  file: File;
  title: string;
  description: string;
  keywords: string[];
}
