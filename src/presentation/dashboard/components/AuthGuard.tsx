import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/useLanguage';
import { SettingsMenu } from './SettingsMenu';
import './authguard.css';

export const AuthGuard: React.FC = () => {
  const { t } = useLanguage();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Auto-open settings menu on first load (onboarding)
  useEffect(() => {
    // Small delay to ensure smooth animation
    const timer = setTimeout(() => {
      setIsSettingsOpen(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="auth-guard">
      <div className="auth-guard-content">
        <h1>{t.githubExtension}</h1>
        <p>{t.configureToken}</p>
        <div className="auth-guard-instructions">
          <p className="auth-guard-step" style={{ marginBottom: '16px' }}>
            <strong>{t.oauthInstructions}</strong>
          </p>
          <p className="auth-guard-step" style={{ marginTop: '16px', fontSize: '14px', color: '#586069' }}>
            {t.language === 'en' 
              ? 'Alternatively, you can manually enter a Personal Access Token in the settings.' 
              : 'または、設定でPersonal Access Tokenを手動で入力することもできます。'}
          </p>
        </div>
        <button onClick={() => setIsSettingsOpen(true)} className="configure-button">
          <i className="fas fa-cog"></i>
          <span>{t.openSettings}</span>
        </button>
      </div>
      <SettingsMenu isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

