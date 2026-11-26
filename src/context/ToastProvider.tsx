import { useCallback, useEffect, useState, type ReactNode } from 'react';
import NotificationToast, { type NotificationToastProps } from '../components/NotificationToast/NotificationToast';
import { ToastContext, type ShowToast } from '../hooks/useToast';
import { watchConnection } from '../network/connection';

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<NotificationToastProps | null>(null);
  const showToast = useCallback<ShowToast>((message, severity = 'info') => {
    setToast({ message, severity });
  }, []);

  useEffect(() => {
    let connectionToast: NotificationToastProps | null = null;
    return watchConnection((notification) => {
      if (notification) {
        connectionToast = notification;
        setToast(notification);
      } else {
        const recoveredToast = connectionToast;
        setToast((current) => (current === recoveredToast ? null : current));
      }
    });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && <NotificationToast {...toast} />}
    </ToastContext.Provider>
  );
}
