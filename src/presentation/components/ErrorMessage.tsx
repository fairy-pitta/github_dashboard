import React from 'react';
import './styles/error.css';

interface ErrorMessageProps {
  error: Error | string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry,
}) => {
  const message = typeof error === 'string' ? error : error.message;

  return (
    <div className="error-message-container">
      <div className="error-icon">⚠️</div>
      <div className="error-content">
        <h3>Error</h3>
        <p>{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="retry-button">
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

