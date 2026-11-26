import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/main.scss';
import App from './App';
import { ToastProvider } from './context/ToastProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>
);
