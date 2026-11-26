import { createContext, useContext } from 'react';
import type { NotificationToastProps } from '../components/NotificationToast/NotificationToast';

export type ShowToast = (message: string, severity?: NotificationToastProps['severity']) => void;

export const ToastContext = createContext<ShowToast | null>(null);

export function useToast() {
  const showToast = useContext(ToastContext);
  if (!showToast) throw new Error('useToast must be used within ToastProvider');
  return showToast;
}
