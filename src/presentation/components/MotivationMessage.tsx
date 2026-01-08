import React, { useMemo } from 'react';
import { ContributionStreak } from '@/domain/entities/ContributionStreak';
import { DashboardData } from '@/domain/usecases/GetDashboardData';
import { useLanguage } from '../i18n/useLanguage';
import {
  getTimeOfDay,
  getMessageCategory,
  getMotivationMessage,
  ActivityContext,
} from '../utils/motivationMessages';
import './styles/motivation-message.css';

interface MotivationMessageProps {
  dashboardData: DashboardData | null;
  streak: ContributionStreak | null;
  loading?: boolean;
}

export const MotivationMessage: React.FC<MotivationMessageProps> = React.memo(
  ({ dashboardData, streak, loading = false }) => {
    const { t, language } = useLanguage();

    const message = useMemo(() => {
      if (loading || !dashboardData) {
        return null;
      }

      const timeOfDay = getTimeOfDay();

      // Build activity context
      const context: ActivityContext = {
        prCount: dashboardData.createdPRs.length,
        reviewRequestedCount: dashboardData.reviewRequestedPRs.length,
        issueCount: dashboardData.involvedIssues.length,
        streakDays: streak?.currentStreak ?? 0,
      };

      // Get message category based on activity
      const category = getMessageCategory(context);

      // Get and select random message
      const selectedMessage = getMotivationMessage(t.motivationMessages, category, timeOfDay);

      return selectedMessage;
    }, [dashboardData, streak, loading, language, t]);

    if (loading) {
      return (
        <div className="motivation-message-section">
          <div className="motivation-message-content">
            <div className="motivation-message-skeleton"></div>
          </div>
        </div>
      );
    }

    if (!message) {
      return null;
    }

    return (
      <div className="motivation-message-section">
        <div className="motivation-message-content">
          <p className="motivation-message-text">{message}</p>
        </div>
      </div>
    );
  }
);

MotivationMessage.displayName = 'MotivationMessage';

