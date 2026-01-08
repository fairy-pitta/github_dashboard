import React, { useState, useEffect } from 'react';
import { TokenInput } from './components/TokenInput';
import { SaveButton } from './components/SaveButton';
import { StatusMessage } from './components/StatusMessage';
import { Container } from '@/application/di/Container';
import { StorageKeys } from '@/infrastructure/storage/StorageKeys';
import './styles/options.css';

export const OptionsApp: React.FC = () => {
  const [token, setToken] = useState('');
  const [showOnGitHub, setShowOnGitHub] = useState(true);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  useEffect(() => {
    // Load saved token and settings
    const loadSettings = async () => {
      try {
        const container = Container.getInstance();
        const storage = container.getStorage();
        const savedToken = await storage.get<string>(StorageKeys.PAT_TOKEN);
        const savedShowOnGitHub = await storage.get<boolean>(StorageKeys.SHOW_ON_GITHUB);
        
        if (savedToken) {
          setToken(savedToken);
          // Initialize container if token exists
          try {
            await container.initialize(savedToken);
          } catch {
            // Ignore initialization errors
          }
        }
        
        if (savedShowOnGitHub !== undefined) {
          setShowOnGitHub(savedShowOnGitHub);
        }
      } catch {
        // Ignore errors
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    if (!token.trim()) {
      setStatus({
        type: 'error',
        message: 'Token cannot be empty',
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const container = Container.getInstance();
      const storage = container.getStorage();

      // First, validate the token by initializing container with it
      await container.initialize(token.trim());

      // If initialization succeeds, save token to storage
      await storage.set(StorageKeys.PAT_TOKEN, token.trim());

      setStatus({
        type: 'success',
        message: 'Token saved successfully! Please refresh the new tab page.',
      });
    } catch (error) {
      console.error('Token save error:', error);
      setStatus({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to save token. Please check your token and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDismissStatus = () => {
    setStatus(null);
  };

  const handleToggleShowOnGitHub = async () => {
    const newValue = !showOnGitHub;
    setShowOnGitHub(newValue);
    try {
      const container = Container.getInstance();
      const storage = container.getStorage();
      await storage.set(StorageKeys.SHOW_ON_GITHUB, newValue);
      setStatus({
        type: 'success',
        message: newValue
          ? 'Dashboard will now show on GitHub pages. Please refresh any open GitHub tabs.'
          : 'Dashboard disabled on GitHub pages.',
      });
    } catch (error) {
      console.error('Failed to save setting:', error);
      setShowOnGitHub(!newValue); // Revert on error
    }
  };

  return (
    <div className="options-container">
      <div className="options-content">
        <h1>GitHub Extension Settings</h1>
        <p className="options-description">
          Enter your GitHub Personal Access Token to enable the extension.
        </p>

        <div className="options-form">
          <TokenInput
            value={token}
            onChange={setToken}
            error={status?.type === 'error' ? status.message : undefined}
            disabled={loading}
          />

          <SaveButton
            onClick={handleSave}
            loading={loading}
            disabled={!token.trim()}
          />

          <div className="options-setting">
            <label className="options-setting-label">
              <input
                type="checkbox"
                checked={showOnGitHub}
                onChange={handleToggleShowOnGitHub}
                className="options-checkbox"
              />
              <span>Show dashboard on GitHub pages</span>
            </label>
            <p className="options-setting-description">
              When enabled, the dashboard will replace GitHub pages. You can revert to the original GitHub page using the button in the top-right corner.
            </p>
          </div>

          {status && (
            <StatusMessage
              type={status.type}
              message={status.message}
              onDismiss={handleDismissStatus}
            />
          )}
        </div>
      </div>
    </div>
  );
};

