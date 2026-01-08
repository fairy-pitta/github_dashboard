import React, { useEffect, useState } from 'react';
import { AchievementBadge } from '@/domain/entities/AchievementBadge';
import { useLanguage } from '../i18n/useLanguage';
import './styles/achievement-badges.css';

interface AchievementBadgesProps {
  badges: AchievementBadge[];
  loading?: boolean;
}

export const AchievementBadges: React.FC<AchievementBadgesProps> = ({ badges, loading = false }) => {
  const { t } = useLanguage();
  const [newlyAchieved, setNewlyAchieved] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Check for newly achieved badges
    const achievedIds = new Set(
      badges.filter((b) => b.achieved).map((b) => b.id)
    );
    setNewlyAchieved(achievedIds);
  }, [badges]);

  if (loading) {
    return (
      <div className="achievement-badges">
        <div className="achievement-badges-skeleton">
          <div className="skeleton-badge"></div>
          <div className="skeleton-badge"></div>
          <div className="skeleton-badge"></div>
        </div>
      </div>
    );
  }

  const achievedBadges = badges.filter((b) => b.achieved);
  const inProgressBadges = badges.filter((b) => !b.achieved && b.progress > 0);

  if (achievedBadges.length === 0 && inProgressBadges.length === 0) {
    return null;
  }

  return (
    <div className="achievement-badges">
      <div className="achievement-badges-header">
        <i className="fas fa-trophy achievement-icon"></i>
        <h3 className="achievement-title">{t.achievementsTitle || '実績バッジ'}</h3>
      </div>
      <div className="achievement-badges-grid">
        {achievedBadges.map((badge) => (
          <div
            key={badge.id}
            className={`achievement-badge achievement-badge-achieved ${
              newlyAchieved.has(badge.id) ? 'achievement-badge-new' : ''
            }`}
            title={badge.description}
          >
            <i className={`fas ${badge.icon} achievement-badge-icon`}></i>
            <div className="achievement-badge-content">
              <div className="achievement-badge-name">{badge.name}</div>
              <div className="achievement-badge-description">{badge.description}</div>
            </div>
            {newlyAchieved.has(badge.id) && (
              <div className="achievement-badge-sparkle">
                <i className="fas fa-sparkles"></i>
              </div>
            )}
          </div>
        ))}
        {inProgressBadges.map((badge) => {
          const progressPercent = Math.min((badge.progress / badge.target) * 100, 100);
          return (
            <div
              key={badge.id}
              className="achievement-badge achievement-badge-progress"
              title={`${badge.description} (${badge.progress}/${badge.target})`}
            >
              <i className={`fas ${badge.icon} achievement-badge-icon`}></i>
              <div className="achievement-badge-content">
                <div className="achievement-badge-name">{badge.name}</div>
                <div className="achievement-badge-progress-bar">
                  <div
                    className="achievement-badge-progress-fill"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <div className="achievement-badge-progress-text">
                  {badge.progress} / {badge.target}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

