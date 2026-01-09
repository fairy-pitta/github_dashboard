import React from 'react';
import ReactDOM from 'react-dom/client';
import { DashboardApp } from './DashboardApp';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { LanguageProvider } from '../i18n/LanguageProvider';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <DashboardApp />
      </LanguageProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

