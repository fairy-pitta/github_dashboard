import React, { useState, useEffect, useMemo } from 'react';
import { PullRequest } from '@/domain/entities/PullRequest';
import { PRCard } from './PRCard';
import { LoadMoreButton } from './LoadMoreButton';
import { SkeletonLoader } from './SkeletonLoader';
import { ReviewStatusFilter, ReviewStatusFilterOption } from './ReviewStatusFilter';
import { useLanguage } from '../i18n/useLanguage';
import { useServices } from '../context/ServiceContext';
import './styles/section.css';
import './styles/pr-tabs.css';

interface PullRequestSectionProps {
  createdPRs: PullRequest[];
  reviewRequestedPRs: PullRequest[];
  loading?: boolean;
}

type TabType = 'created' | 'review-requested';

export const PullRequestSection: React.FC<PullRequestSectionProps> = React.memo(({
  createdPRs: initialCreatedPRs,
  reviewRequestedPRs: initialReviewRequestedPRs,
  loading = false,
}) => {
  const services = useServices();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('created');
  const [createdPRs, setCreatedPRs] = useState<PullRequest[]>(initialCreatedPRs);
  const [reviewRequestedPRs, setReviewRequestedPRs] = useState<PullRequest[]>(initialReviewRequestedPRs);
  const [loadingMore, setLoadingMore] = useState(false);
  const [createdCursor, setCreatedCursor] = useState<string | undefined>();
  const [reviewRequestedCursor, setReviewRequestedCursor] = useState<string | undefined>();
  const [hasMoreCreated, setHasMoreCreated] = useState(true);
  const [hasMoreReviewRequested, setHasMoreReviewRequested] = useState(true);
  const [reviewFilters, setReviewFilters] = useState<ReviewStatusFilterOption[]>(['ALL']);

  // Update PRs when initial PRs change
  useEffect(() => {
    setCreatedPRs(initialCreatedPRs);
    setReviewRequestedPRs(initialReviewRequestedPRs);
    // Reset cursors when initial data changes
    setCreatedCursor(undefined);
    setReviewRequestedCursor(undefined);
    setHasMoreCreated(true);
    setHasMoreReviewRequested(true);
  }, [initialCreatedPRs, initialReviewRequestedPRs]);


  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const prRepo = services.getPullRequestRepository();
      
      if (activeTab === 'created') {
        const result = await prRepo.getCreatedByMe(10, createdCursor);
        setCreatedPRs((prev) => [...prev, ...result.prs]);
        setCreatedCursor(result.nextCursor);
        setHasMoreCreated(!!result.nextCursor);
      } else {
        const result = await prRepo.getReviewRequested(10, reviewRequestedCursor);
        setReviewRequestedPRs((prev) => [...prev, ...result.prs]);
        setReviewRequestedCursor(result.nextCursor);
        setHasMoreReviewRequested(!!result.nextCursor);
      }
    } catch (error) {
      console.error('Failed to load more PRs:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Filter PRs based on review status
  const filteredPRs = useMemo(() => {
    const prs = activeTab === 'created' ? createdPRs : reviewRequestedPRs;
    
    if (reviewFilters.includes('ALL') || reviewFilters.length === 0) {
      return prs;
    }

    return prs.filter((pr) => {
      // Check if any review matches the selected filters
      const reviewStates = pr.reviews.map((review) => review.state);
      const hasMatchingReview = reviewFilters.some((filter) => {
        if (filter === 'REVIEW_REQUIRED') {
          // REVIEW_REQUIRED: either reviewDecision is REVIEW_REQUIRED or no reviews yet
          return pr.reviewDecision === 'REVIEW_REQUIRED' || 
                 (pr.reviewDecision === null && pr.reviews.length === 0);
        }
        return reviewStates.includes(filter);
      });

      // Also check reviewDecision for APPROVED and CHANGES_REQUESTED
      if (reviewFilters.includes('APPROVED') && pr.reviewDecision === 'APPROVED') {
        return true;
      }
      if (reviewFilters.includes('CHANGES_REQUESTED') && pr.reviewDecision === 'CHANGES_REQUESTED') {
        return true;
      }

      return hasMatchingReview;
    });
  }, [activeTab, createdPRs, reviewRequestedPRs, reviewFilters]);

  const currentPRs = filteredPRs;
  const currentTitle = activeTab === 'created' ? t.pullRequestsCreated : t.pullRequestsReviewRequested;
  const currentEmptyMessage = activeTab === 'created' ? t.noPullRequests : t.noPullRequestsReview;
  const currentIcon = activeTab === 'created' ? 'fa-code-pull-request' : 'fa-user-check';
  const currentHasMore = activeTab === 'created' ? hasMoreCreated : hasMoreReviewRequested;

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
          <div className="pr-tab-header-actions">
            <ReviewStatusFilter
              selectedFilters={reviewFilters}
              onChange={setReviewFilters}
              disabled={loading}
            />
          </div>
        </div>
        <div className="section-content">
          {currentPRs.length === 0 ? (
            <p className="empty-message">{currentEmptyMessage}</p>
          ) : (
            <>
              {currentPRs.map((pr) => (
                <PRCard key={`${pr.repository.nameWithOwner}-${pr.number}`} pr={pr} />
              ))}
              <LoadMoreButton
                onClick={handleLoadMore}
                loading={loadingMore}
                hasMore={currentHasMore}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
});

