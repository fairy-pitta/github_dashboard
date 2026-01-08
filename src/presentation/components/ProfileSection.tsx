import React, { useState, useEffect } from 'react';
import { User } from '@/domain/entities/User';
import { ContributionCalendar } from '@/domain/entities/ContributionCalendar';
import { Container } from '@/application/di/Container';
import { useLanguage } from '../i18n/useLanguage';
import { SkeletonLoader } from './SkeletonLoader';
import './styles/profile-section.css';

interface ProfileSectionProps {
  user: User | null;
  loading?: boolean;
}

export const ProfileSection: React.FC<ProfileSectionProps> = React.memo(({ user, loading = false }) => {
  const { t } = useLanguage();
  const [calendar, setCalendar] = useState<ContributionCalendar | null>(null);
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setCalendarLoading(false);
      return;
    }

    const fetchCalendar = async () => {
      try {
        setCalendarLoading(true);
        setCalendarError(null);
        const container = Container.getInstance();
        const calendarRepo = container.getContributionCalendarRepository();
        
        // Get last year's contributions (exactly 365 days ago to now)
        const now = new Date();
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        // Set to start of day for consistency
        oneYearAgo.setHours(0, 0, 0, 0);
        now.setHours(23, 59, 59, 999);
        
        const calendarData = await calendarRepo.getCalendar(
          oneYearAgo.toISOString(),
          now.toISOString()
        );
        setCalendar(calendarData);
      } catch (error) {
        console.error('Failed to fetch contribution calendar:', error);
        setCalendarError(
          error instanceof Error ? error.message : 'Failed to load contribution calendar'
        );
      } finally {
        setCalendarLoading(false);
      }
    };

    fetchCalendar();
  }, [user]);

  if (loading || !user) {
    return (
      <section className="dashboard-section profile-section">
        <div className="profile-content">
          <SkeletonLoader count={1} />
        </div>
      </section>
    );
  }

  const getContributionLevel = (count: number): string => {
    if (count === 0) return 'level-0';
    if (count <= 3) return 'level-1';
    if (count <= 6) return 'level-2';
    if (count <= 9) return 'level-3';
    return 'level-4';
  };

  // Get all contribution days from all weeks
  const allDays: Array<{ date: string; count: number; color: string }> = [];
  calendar?.weeks.forEach((week) => {
    week.contributionDays.forEach((day) => {
      allDays.push({
        date: day.date,
        count: day.contributionCount,
        color: day.color,
      });
    });
  });

  // Get last 365 days (or less if we don't have that much data)
  const displayDays = allDays.slice(-365);

  return (
    <section className="dashboard-section profile-section">
      <div className="profile-content">
        <div className="profile-header">
          {user.avatarUrl && (
            <img src={user.avatarUrl} alt={user.login} className="profile-avatar" />
          )}
          <div className="profile-info">
            <h2 className="profile-name">{user.name || user.login}</h2>
            <p className="profile-username">@{user.login}</p>
            {calendar && (
              <p className="profile-contributions">
                {calendar.totalContributions} {t.contributionsLastYear}
              </p>
            )}
          </div>
        </div>
        {calendarLoading ? (
          <div className="contribution-calendar-loading">
            <SkeletonLoader count={1} />
          </div>
        ) : calendarError ? (
          <div className="contribution-calendar-error">
            <p style={{ color: 'var(--text-color-secondary)', fontSize: '0.875rem' }}>
              {calendarError}
            </p>
          </div>
        ) : calendar && calendar.weeks.length > 0 ? (
          <div className="contribution-calendar">
            <div className="contribution-grid">
              {displayDays.map((day, index) => (
                <div
                  key={`${day.date}-${index}`}
                  className={`contribution-day ${getContributionLevel(day.count)}`}
                  style={{ backgroundColor: day.color }}
                  title={`${day.date}: ${day.count} contributions`}
                />
              ))}
            </div>
            <div className="contribution-legend">
              <span className="legend-label">Less</span>
              <div className="legend-levels">
                <div className="legend-level level-0" />
                <div className="legend-level level-1" />
                <div className="legend-level level-2" />
                <div className="legend-level level-3" />
                <div className="legend-level level-4" />
              </div>
              <span className="legend-label">More</span>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
});

