import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import styles from '../components/NotificationToast/NotificationToast.module.scss';
import { useToast } from '../hooks/useToast';
import { ToastProvider } from './ToastProvider';

function ToastButtons() {
  const showToast = useToast();
  return (
    <>
      <button onClick={() => showToast('Saved')}>Save</button>
      <button onClick={() => showToast('Failed', 'error')}>Fail</button>
    </>
  );
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it('lets a child replace a toast and gives the new toast its full display time', () => {
  vi.useFakeTimers();
  render(
    <ToastProvider>
      <ToastButtons />
    </ToastProvider>
  );

  expect(screen.queryByRole('status')).toBeNull();
  fireEvent.click(screen.getByText('Save'));
  expect(screen.getByRole('status')).toHaveTextContent('Saved');
  act(() => vi.advanceTimersByTime(4000));
  fireEvent.click(screen.getByText('Fail'));
  expect(screen.queryByText('Saved')).toBeNull();
  act(() => vi.advanceTimersByTime(1000));
  expect(screen.getByRole('alert')).toHaveTextContent('Failed');
  act(() => vi.advanceTimersByTime(4000));
  expect(screen.queryByRole('alert')).toBeNull();
});

it('shows an error on an offline start and on a later disconnect without connection quality data', () => {
  const online = vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
  render(<ToastProvider>{null}</ToastProvider>);
  expect(screen.getByRole('alert')).toHaveTextContent('You’re offline');
  expect(screen.getByRole('alert')).toHaveClass(styles.error);

  online.mockReturnValue(true);
  fireEvent(window, new Event('online'));
  expect(screen.queryByRole('alert')).toBeNull();

  online.mockReturnValue(false);
  fireEvent(window, new Event('offline'));
  expect(screen.getByRole('alert')).toHaveTextContent('You’re offline');
});

it('warns once per slow connection and preserves other toasts on recovery', () => {
  vi.useFakeTimers();
  const connection = Object.assign(new EventTarget(), { effectiveType: '4g' });
  vi.stubGlobal('navigator', { onLine: true, connection });
  render(<ToastButtons />, { wrapper: ToastProvider });
  expect(screen.queryByRole('status')).toBeNull();

  connection.effectiveType = '2g';
  act(() => connection.dispatchEvent(new Event('change')));
  expect(screen.getByRole('status')).toHaveTextContent('Your connection is slow');
  expect(screen.getByRole('status')).toHaveClass(styles.warning);
  act(() => vi.advanceTimersByTime(5000));
  act(() => connection.dispatchEvent(new Event('change')));
  expect(screen.queryByRole('status')).toBeNull();

  fireEvent.click(screen.getByText('Fail'));
  connection.effectiveType = '4g';
  act(() => connection.dispatchEvent(new Event('change')));
  expect(screen.getByRole('alert')).toHaveTextContent('Failed');
});
