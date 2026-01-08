import React from 'react';
import { useLanguage } from '../i18n/useLanguage';
import './styles/loading.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  message,
}) => {
  const { t } = useLanguage();
  const displayMessage = message || t.loading;
  
  return (
    <div className={`loading-spinner ${size}`}>
      <div className="spinner"></div>
      {displayMessage && <p className="loading-message">{displayMessage}</p>}
    </div>
  );
};


