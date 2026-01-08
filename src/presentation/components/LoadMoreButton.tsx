import React from 'react';
import { useLanguage } from '../../i18n/useLanguage';
import './styles/loadmore.css';

interface LoadMoreButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  hasMore?: boolean;
}

export const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  onClick,
  loading = false,
  disabled = false,
  hasMore = true,
}) => {
  const { t } = useLanguage();
  
  if (!hasMore) {
    return null;
  }

  return (
    <div className="load-more-container">
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className="load-more-button"
      >
        {loading ? (
          <>
            <span className="spinner-small"></span>
            <span>{t.loading}</span>
          </>
        ) : (
          <>
            <i className="fas fa-chevron-down"></i>
            <span>{t.loadMore}</span>
          </>
        )}
      </button>
    </div>
  );
};


