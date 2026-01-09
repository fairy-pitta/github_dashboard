import React from 'react';
import ReactDOM from 'react-dom/client';
import { DashboardApp } from './DashboardApp';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { LanguageProvider } from '../i18n/LanguageProvider';
import { ServiceContextProvider } from '../context/ServiceContext';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ServiceContextProvider>
        <LanguageProvider>
          <DashboardApp />
        </LanguageProvider>
      </ServiceContextProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

