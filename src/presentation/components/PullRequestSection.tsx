import React, { useState } from 'react';
import { PullRequest } from '@/domain/entities/PullRequest';
import { PRCard } from './PRCard';
import { SkeletonLoader } from './SkeletonLoader';
import { useLanguage } from '../i18n/useLanguage';
import './styles/section.css';
import './styles/pr-tabs.css';

interface PullRequestSectionProps {
  createdPRs: PullRequest[];
  reviewRequestedPRs: PullRequest[];
  loading?: boolean;
}

type TabType = 'created' | 'review-requested';

export const PullRequestSection: React.FC<PullRequestSectionProps> = React.memo(({
  createdPRs,
  reviewRequestedPRs,
  loading = false,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('created');

  const currentPRs = activeTab === 'created' ? createdPRs : reviewRequestedPRs;
  const currentTitle = activeTab === 'created' ? t.pullRequestsCreated : t.pullRequestsReviewRequested;
  const currentEmptyMessage = activeTab === 'created' ? t.noPullRequests : t.noPullRequestsReview;
  const currentIcon = activeTab === 'created' ? 'fa-code-pull-request' : 'fa-user-check';

  if (loading) {
    return (
      <section className="dashboard-section">
        <div className="pr-tabs">
          <div className="pr-tab-header">
            <button
              className={`pr-tab ${activeTab === 'created' ? 'active' : ''}`}
              disabled
            >
              <i className="fas fa-code-pull-request"></i>
              {t.pullRequestsCreated}
            </button>
            <button
              className={`pr-tab ${activeTab === 'review-requested' ? 'active' : ''}`}
              disabled
            >
              <i className="fas fa-user-check"></i>
              {t.pullRequestsReviewRequested}
            </button>
          </div>
          <div className="section-content">
            <SkeletonLoader count={3} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-section">
      <div className="pr-tabs">
        <div className="pr-tab-header">
          <button
            className={`pr-tab ${activeTab === 'created' ? 'active' : ''}`}
            onClick={() => setActiveTab('created')}
          >
            <i className="fas fa-code-pull-request"></i>
            {t.pullRequestsCreated}
            {createdPRs.length > 0 && (
              <span className="pr-tab-count">({createdPRs.length})</span>
            )}
          </button>
          <button
            className={`pr-tab ${activeTab === 'review-requested' ? 'active' : ''}`}
            onClick={() => setActiveTab('review-requested')}
          >
            <i className="fas fa-user-check"></i>
            {t.pullRequestsReviewRequested}
            {reviewRequestedPRs.length > 0 && (
              <span className="pr-tab-count">({reviewRequestedPRs.length})</span>
            )}
          </button>
        </div>
        <div className="section-content">
          {currentPRs.length === 0 ? (
            <p className="empty-message">{currentEmptyMessage}</p>
          ) : (
            currentPRs.map((pr) => (
              <PRCard key={`${pr.repository.nameWithOwner}-${pr.number}`} pr={pr} />
            ))
          )}
        </div>
      </div>
    </section>
  );
});

