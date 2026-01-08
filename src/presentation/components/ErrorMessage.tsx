import React from 'react';
import { RateLimitError, AuthenticationError, PermissionError, NetworkError } from '@/domain/errors/DomainError';
import { useLanguage } from '../i18n/useLanguage';
import './styles/error.css';

interface ErrorMessageProps {
  error: Error | string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry,
}) => {
  const { t, language } = useLanguage();
  const errorObj = typeof error === 'string' ? new Error(error) : error;
  
  const getErrorDetails = (error: Error): { title: string; message: string; suggestion?: string } => {
    if (error instanceof RateLimitError) {
      return {
        title: t.rateLimitError,
        message: error.message,
        suggestion: language === 'ja' 
          ? '数分待ってから再度お試しください。レート制限は自動的にリセットされます。'
          : 'Please wait a few minutes before trying again. The rate limit will reset automatically.',
      };
    }
    if (error instanceof AuthenticationError) {
      return {
        title: t.authError,
        message: error.message,
        suggestion: language === 'ja'
          ? '拡張機能の設定でPersonal Access Tokenを確認してください。'
          : 'Please check your Personal Access Token in the extension settings.',
      };
    }
    if (error instanceof PermissionError) {
      return {
        title: t.permissionError,
        message: error.message,
        suggestion: language === 'ja'
          ? 'トークンに必要な権限がない可能性があります。トークンの設定を確認してください。'
          : 'Your token may not have the required permissions. Please check your token settings.',
      };
    }
    if (error instanceof NetworkError) {
      return {
        title: t.networkError,
        message: error.message,
        suggestion: language === 'ja'
          ? 'インターネット接続を確認してから再度お試しください。'
          : 'Please check your internet connection and try again.',
      };
    }
    return {
      title: t.errorTitle,
      message: error.message || (language === 'ja' ? '予期しないエラーが発生しました' : 'An unexpected error occurred'),
    };
  };

  const { title, message, suggestion } = getErrorDetails(errorObj);

  return (
    <div className="error-message-container">
      <div className="error-icon">
        <i className="fas fa-exclamation-triangle"></i>
      </div>
      <div className="error-content">
        <h3>{title}</h3>
        <p>{message}</p>
        {suggestion && (
          <p className="error-suggestion">{suggestion}</p>
        )}
        {onRetry && (
          <button onClick={onRetry} className="retry-button">
            {t.retry}
          </button>
        )}
      </div>
    </div>
  );
};

