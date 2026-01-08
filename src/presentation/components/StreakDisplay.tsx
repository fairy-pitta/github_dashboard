import React from 'react';
import { ContributionStreak } from '@/domain/entities/ContributionStreak';
import { useLanguage } from '../i18n/useLanguage';
import './styles/streak.css';

interface StreakDisplayProps {
  streak: ContributionStreak | null;
  loading?: boolean;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ streak, loading = false }) => {
  const { t } = useLanguage();

  if (loading || !streak) {
    return (
      <div className="streak-display">
        <div className="streak-skeleton">
          <div className="skeleton-line"></div>
        </div>
      </div>
    );
  }

  const getReminderMessage = () => {
    if (streak.todayContributed) {
      return null;
    }
    return t.streakReminder || '今日まだコントリビュートしていません！';
  };

  return (
    <div className="streak-display">
      <div className="streak-header">
        <i className="fas fa-fire streak-icon"></i>
        <h3 className="streak-title">{t.streakTitle || '連続コントリビューション'}</h3>
      </div>
      <div className="streak-content">
        <div className="streak-current">
          <span className="streak-number">{streak.currentStreak}</span>
          <span className="streak-label">{t.streakDays || '日連続'}</span>
        </div>
        {streak.longestStreak > streak.currentStreak && (
          <div className="streak-longest">
            <span className="streak-longest-label">{t.streakLongest || '最長記録'}: </span>
            <span className="streak-longest-number">{streak.longestStreak}</span>
            <span className="streak-longest-label"> {t.streakDays || '日'}</span>
          </div>
        )}
      </div>
      {getReminderMessage() && (
        <div className="streak-reminder">
          <i className="fas fa-bell"></i>
          <span>{getReminderMessage()}</span>
        </div>
      )}
    </div>
  );
};

