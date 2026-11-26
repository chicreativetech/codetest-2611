import styles from './NotificationToast.module.scss';

export type NotificationToastProps = {
  message: string;
  severity: 'error' | 'warning' | 'info';
};

const NotificationToast = ({ message, severity }: NotificationToastProps) => {
  return (
    <div className={`${styles.notificationToast} ${styles[severity]}`} role={severity === 'error' ? 'alert' : 'status'}>
      <i className={`${styles.icon} bi bi-exclamation-circle`} aria-hidden='true' />
      {message}
    </div>
  );
};

export default NotificationToast;
