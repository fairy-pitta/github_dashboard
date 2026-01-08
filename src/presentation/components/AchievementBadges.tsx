import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number; arrowLeft: number } | null>(null);
  const badgeRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Check for newly achieved badges
    const achievedIds = new Set(
      badges.filter((b) => b.achieved).map((b) => b.id)
    );
    setNewlyAchieved(achievedIds);
  }, [badges]);

  const updateTooltipPosition = useCallback((badgeId: string) => {
    const badgeElement = badgeRefs.current.get(badgeId);
    if (!badgeElement) return;

    const badgeRect = badgeElement.getBoundingClientRect();
    const badgeCenterX = badgeRect.left + badgeRect.width / 2;
    const spacing = 8;

    // Get tooltip size if available, otherwise use defaults
    const tooltipWidth = tooltipRef.current?.offsetWidth || 200;
    const tooltipHeight = tooltipRef.current?.offsetHeight || 100;

    // Calculate position: above the badge, centered
    let left = badgeCenterX - tooltipWidth / 2;
    let top = badgeRect.top - tooltipHeight - spacing;

    // Adjust if tooltip would go off screen horizontally
    if (left < 10) {
      left = 10;
    } else if (left + tooltipWidth > window.innerWidth - 10) {
      left = window.innerWidth - tooltipWidth - 10;
    }

    // Adjust if tooltip would go off screen vertically (show below instead)
    if (top < 10) {
      top = badgeRect.bottom + spacing;
    }

    // Calculate arrow position relative to tooltip
    const arrowLeft = badgeCenterX - left;

    setTooltipPosition({ top, left, arrowLeft });
  }, []);

  const handleBadgeMouseEnter = useCallback((badgeId: string) => {
    setHoveredBadge(badgeId);
  }, []);

  // Adjust tooltip position after it's rendered to account for actual size
  useEffect(() => {
    if (!hoveredBadge) return;

    // Use requestAnimationFrame to ensure tooltip is rendered
    requestAnimationFrame(() => {
      updateTooltipPosition(hoveredBadge);
    });
  }, [hoveredBadge, updateTooltipPosition]);

  const handleBadgeMouseLeave = () => {
    setHoveredBadge(null);
    setTooltipPosition(null);
  };

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

  const hoveredBadgeData = achievedBadges.find((b) => b.id === hoveredBadge);
  const remaining = hoveredBadgeData?.nextTarget ? Math.max(0, hoveredBadgeData.nextTarget - hoveredBadgeData.progress) : null;

  const tooltipElement = hoveredBadgeData && tooltipPosition ? (
    <div
      ref={tooltipRef}
      className="achievement-badge-tooltip achievement-badge-tooltip-fixed"
      style={{
        top: `${tooltipPosition.top}px`,
        left: `${tooltipPosition.left}px`,
        '--arrow-left': `${tooltipPosition.arrowLeft}px`,
      } as React.CSSProperties}
    >
      <span className="achievement-badge-tooltip-name">{hoveredBadgeData.name}</span>
      <span className="achievement-badge-tooltip-description">{hoveredBadgeData.description}</span>
      {hoveredBadgeData.nextTarget && remaining !== null && remaining > 0 && (
        <span className="achievement-badge-tooltip-remaining">
          次の称号（{hoveredBadgeData.nextName ?? '次'}）まであと {remaining}
        </span>
      )}
    </div>
  ) : null;

  return (
    <>
      <div className="achievement-badges-compact">
        <span className="achievement-icon-compact" title={t.achievementsTitle || '実績バッジ'}>
          <i className="fas fa-trophy"></i>
          <span className="achievement-icon-text">{t.achievementsTitle || '実績'}</span>
        </span>
        <div className="achievement-badges-list">
          {achievedBadges.map((badge) => (
            <span
              key={badge.id}
              ref={(el) => {
                if (el) {
                  badgeRefs.current.set(badge.id, el);
                } else {
                  badgeRefs.current.delete(badge.id);
                }
              }}
              className={`achievement-badge-compact achievement-badge-achieved ${
                newlyAchieved.has(badge.id) ? 'achievement-badge-new' : ''
              }`}
              onMouseEnter={(e) => handleBadgeMouseEnter(badge.id, e)}
              onMouseLeave={handleBadgeMouseLeave}
            >
              <i className={`fas ${badge.icon}`}></i>
              {newlyAchieved.has(badge.id) && (
                <span className="achievement-badge-sparkle-compact">
                  <i className="fas fa-sparkles"></i>
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
      {tooltipElement && typeof document !== 'undefined' && createPortal(tooltipElement, document.body)}
    </>
  );
};

