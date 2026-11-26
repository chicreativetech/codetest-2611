import type { NotificationToastProps } from '../components/NotificationToast/NotificationToast';

type Connection = EventTarget & { effectiveType?: string };

const offlineToast: NotificationToastProps = {
  message: 'You’re offline. Check your internet connection.',
  severity: 'error'
};
const slowToast: NotificationToastProps = {
  message: 'Your connection is slow. Shows may take longer to load.',
  severity: 'warning'
};

export function watchConnection(onChange: (toast: NotificationToastProps | null) => void) {
  const { connection } = navigator as Navigator & { connection?: Connection };
  let previous: NotificationToastProps | null = null;

  function check() {
    let toast: NotificationToastProps | null = null;
    if (!navigator.onLine) {
      toast = offlineToast;
    } else if (['slow-2g', '2g', '3g'].includes(connection?.effectiveType ?? '')) {
      toast = slowToast;
    }

    if (toast !== previous) {
      previous = toast;
      onChange(toast);
    }
  }

  window.addEventListener('online', check);
  window.addEventListener('offline', check);
  connection?.addEventListener('change', check);
  check();
  return () => {
    window.removeEventListener('online', check);
    window.removeEventListener('offline', check);
    connection?.removeEventListener('change', check);
  };
}
