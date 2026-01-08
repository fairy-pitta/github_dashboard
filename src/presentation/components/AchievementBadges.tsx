import React, { useEffect, useState } from 'react';
import { AchievementBadge } from '@/domain/entities/AchievementBadge';
import { useLanguage } from '../i18n/useLanguage';
import { AchievementInfoModal } from './AchievementInfoModal';
import './styles/achievement-badges.css';

interface AchievementBadgesProps {
  badges: AchievementBadge[];
  loading?: boolean;
}

export const AchievementBadges: React.FC<AchievementBadgesProps> = ({ badges, loading = false }) => {
  const { t, language } = useLanguage();
  const [newlyAchieved, setNewlyAchieved] = useState<Set<string>>(new Set());
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  // Translation mapping for badge names and descriptions
  const translateBadge = (badge: AchievementBadge): { name: string; description: string; nextName: string | null } => {
    const translations: Record<string, Record<string, { name: string; description: string }>> = {
      'PR Rookie': {
        en: { name: 'PR Rookie', description: 'Create 5 PRs this week' },
        ja: { name: 'PR Rookie', description: '今週5個のPRを作成' },
      },
      'PR Master': {
        en: { name: 'PR Master', description: 'Create 10 PRs this week' },
        ja: { name: 'PR Master', description: '今週10個のPRを作成' },
      },
      'PR Elite': {
        en: { name: 'PR Elite', description: 'Create 20 PRs this week' },
        ja: { name: 'PR Elite', description: '今週20個のPRを作成' },
      },
      'PR Legend': {
        en: { name: 'PR Legend', description: 'Create 40 PRs this week' },
        ja: { name: 'PR Legend', description: '今週40個のPRを作成' },
      },
      'PR Builder': {
        en: { name: 'PR Builder', description: 'Create 10 PRs this month' },
        ja: { name: 'PR Builder', description: '今月10個のPRを作成' },
      },
      'PR Champion': {
        en: { name: 'PR Champion', description: 'Create 25 PRs this month' },
        ja: { name: 'PR Champion', description: '今月25個のPRを作成' },
      },
      'PR Titan': {
        en: { name: 'PR Titan', description: 'Create 50 PRs this month' },
        ja: { name: 'PR Titan', description: '今月50個のPRを作成' },
      },
      'PR Emperor': {
        en: { name: 'PR Emperor', description: 'Create 100 PRs this month' },
        ja: { name: 'PR Emperor', description: '今月100個のPRを作成' },
      },
      'Commit Squire': {
        en: { name: 'Commit Squire', description: '50 commits this month' },
        ja: { name: 'Commit Squire', description: '今月50回のコミット' },
      },
      'Commit King': {
        en: { name: 'Commit King', description: '100 commits this month' },
        ja: { name: 'Commit King', description: '今月100回のコミット' },
      },
      'Commit Emperor': {
        en: { name: 'Commit Emperor', description: '250 commits this month' },
        ja: { name: 'Commit Emperor', description: '今月250回のコミット' },
      },
      'Commit Titan': {
        en: { name: 'Commit Titan', description: '500 commits this month' },
        ja: { name: 'Commit Titan', description: '今月500回のコミット' },
      },
      'Commit Legend': {
        en: { name: 'Commit Legend', description: '1000 commits this month' },
        ja: { name: 'Commit Legend', description: '今月1000回のコミット' },
      },
      'Reviewer': {
        en: { name: 'Reviewer', description: '3 reviews this week' },
        ja: { name: 'Reviewer', description: '今週3回のレビュー' },
      },
      'Review Helper': {
        en: { name: 'Review Helper', description: '5 reviews this week' },
        ja: { name: 'Review Helper', description: '今週5回のレビュー' },
      },
      'Review Master': {
        en: { name: 'Review Master', description: '10 reviews this week' },
        ja: { name: 'Review Master', description: '今週10回のレビュー' },
      },
      'Review Legend': {
        en: { name: 'Review Legend', description: '20 reviews this week' },
        ja: { name: 'Review Legend', description: '今週20回のレビュー' },
      },
      'Starter': {
        en: { name: 'Starter', description: '3 days contribution streak' },
        ja: { name: 'Starter', description: '連続3日コントリビュート' },
      },
      'Week Warrior': {
        en: { name: 'Week Warrior', description: '7 days contribution streak' },
        ja: { name: 'Week Warrior', description: '連続7日コントリビュート' },
      },
      'Fortnight Fighter': {
        en: { name: 'Fortnight Fighter', description: '14 days contribution streak' },
        ja: { name: 'Fortnight Fighter', description: '連続14日コントリビュート' },
      },
      'Month Master': {
        en: { name: 'Month Master', description: '30 days contribution streak' },
        ja: { name: 'Month Master', description: '連続30日コントリビュート' },
      },
      'Streak Veteran': {
        en: { name: 'Streak Veteran', description: '60 days contribution streak' },
        ja: { name: 'Streak Veteran', description: '連続60日コントリビュート' },
      },
      'Streak Legend': {
        en: { name: 'Streak Legend', description: '100 days contribution streak' },
        ja: { name: 'Streak Legend', description: '連続100日コントリビュート' },
      },
    };

    const current = translations[badge.name]?.[language] || { name: badge.name, description: badge.description };
    const next = badge.nextName ? (translations[badge.nextName]?.[language] || { name: badge.nextName, description: '' }) : null;

    return {
      name: current.name,
      description: current.description,
      nextName: next?.name || null,
    };
  };

  useEffect(() => {
    // Check for newly achieved badges
    const achievedIds = new Set(
      badges.filter((b) => b.achieved).map((b) => b.id)
    );
    setNewlyAchieved(achievedIds);
  }, [badges]);

  if (loading) {
    return (
      <div className="achievement-badges-compact">
        <div className="achievement-badges-skeleton-compact">
          <div className="skeleton-badge-compact"></div>
          <div className="skeleton-badge-compact"></div>
          <div className="skeleton-badge-compact"></div>
        </div>
      </div>
    );
  }

  // Only show badges that have been achieved (at least one level)
  const achievedBadges = badges.filter((b) => b.achieved);

  if (achievedBadges.length === 0) {
    return null;
  }

  return (
    <>
      <div className="achievement-badges-compact">
        <span className="achievement-icon-compact" title={t.achievementsTitle || '実績バッジ'}>
          <i className="fas fa-trophy"></i>
          <span className="achievement-icon-text">{t.achievementsTitle || '実績'}</span>
        </span>
        <button
          className="achievement-info-button"
          onClick={() => setIsInfoModalOpen(true)}
          title={t.achievementInfoTitle}
          aria-label={t.achievementInfoTitle}
        >
          <i className="fas fa-info-circle"></i>
        </button>
        <div className="achievement-badges-list">
        {achievedBadges.map((badge) => {
          const remaining = badge.nextTarget ? Math.max(0, badge.nextTarget - badge.progress) : null;
          const translated = translateBadge(badge);

          return (
            <div
              key={badge.id}
              className={`achievement-badge-compact achievement-badge-achieved ${
                newlyAchieved.has(badge.id) ? 'achievement-badge-new' : ''
              }`}
            >
              <i className={`fas ${badge.icon}`}></i>
              {newlyAchieved.has(badge.id) && (
                <span className="achievement-badge-sparkle-compact">
                  <i className="fas fa-sparkles"></i>
                </span>
              )}
              <div className="achievement-badge-tooltip">
                <div className="achievement-badge-tooltip-name">{translated.name}</div>
                <div className="achievement-badge-tooltip-description">{translated.description}</div>
                {badge.nextTarget && remaining !== null && remaining > 0 && (
                  <div className="achievement-badge-tooltip-remaining">
                    {language === 'ja' 
                      ? `${t.achievementNextTitle}（${translated.nextName ?? t.achievementNext}）${t.achievementRemaining} ${remaining}`
                      : `${t.achievementNextTitle} (${translated.nextName ?? t.achievementNext}) ${t.achievementRemaining} ${remaining}`
                    }
                  </div>
                )}
              </div>
            </div>
          );
        })}
        </div>
      </div>
      <AchievementInfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </>
  );
};
