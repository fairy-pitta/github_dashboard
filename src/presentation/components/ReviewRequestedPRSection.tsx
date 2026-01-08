import React from 'react';
import { PullRequest } from '@/domain/entities/PullRequest';
import { PRCard } from './PRCard';
import { SkeletonLoader } from './SkeletonLoader';
import { useLanguage } from '../i18n/useLanguage';
import './styles/section.css';

interface ReviewRequestedPRSectionProps {
  prs: PullRequest[];
  loading?: boolean;
}

export const ReviewRequestedPRSection: React.FC<ReviewRequestedPRSectionProps> = React.memo(({
  prs,
  loading = false,
}) => {
  const { t } = useLanguage();
  if (loading) {
    return (
      <section className="dashboard-section">
        <h2 className="section-title">
          <i className="fas fa-user-check"></i>
          {t.pullRequestsReviewRequested}
        </h2>
        <div className="section-content">
          <SkeletonLoader count={3} />
        </div>
      </section>
    );
  }

  if (prs.length === 0) {
    return (
      <section className="dashboard-section">
        <h2 className="section-title">
          <i className="fas fa-user-check"></i>
          {t.pullRequestsReviewRequested}
        </h2>
        <div className="section-content">
          <p className="empty-message">{t.noPullRequestsReview}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-section">
      <h2 className="section-title">Pull Requests (Review Requested)</h2>
      <div className="section-content">
        {prs.map((pr) => (
          <PRCard key={`${pr.repository.nameWithOwner}-${pr.number}`} pr={pr} />
        ))}
      </div>
    </section>
  );
});

