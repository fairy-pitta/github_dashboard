import React from 'react';
import { useLanguage } from '../i18n/useLanguage';
import './styles/refresh.css';

interface RefreshButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  onClick,
  loading = false,
  disabled = false,
}) => {
  const { t } = useLanguage();
  
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="refresh-button"
      aria-label={t.refresh}
    >
      {loading ? (
        <>
          <span className="spinner-small"></span>
          <span>{t.refreshing}</span>
        </>
      ) : (
        <>
          <i className="fas fa-sync-alt refresh-icon"></i>
          <span>{t.refresh}</span>
        </>
      )}
    </button>
  );
};


