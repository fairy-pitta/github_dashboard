import React from 'react';
import { PullRequest } from '@/domain/entities/PullRequest';
import './styles/cards.css';

interface PRCardProps {
  pr: PullRequest;
  onClick?: () => void;
}

export const PRCard: React.FC<PRCardProps> = ({ pr, onClick }) => {
  const getStateBadgeClass = (state: string, reviewDecision: string | null) => {
    if (state === 'MERGED') return 'badge-merged';
    if (state === 'CLOSED') return 'badge-closed';
    if (reviewDecision === 'APPROVED') return 'badge-approved';
    if (reviewDecision === 'CHANGES_REQUESTED') return 'badge-changes-requested';
    return 'badge-open';
  };

  const getStateLabel = (state: string, reviewDecision: string | null) => {
    if (state === 'MERGED') return 'Merged';
    if (state === 'CLOSED') return 'Closed';
    if (reviewDecision === 'APPROVED') return 'Approved';
    if (reviewDecision === 'CHANGES_REQUESTED') return 'Changes Requested';
    return 'Open';
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.open(pr.url, '_blank');
    }
  };

  return (
    <div className="card pr-card" onClick={handleClick}>
      <div className="card-header">
        <span className={`badge ${getStateBadgeClass(pr.state, pr.reviewDecision)}`}>
          {getStateLabel(pr.state, pr.reviewDecision)}
        </span>
        <span className="card-repo">{pr.repository.nameWithOwner}</span>
      </div>
      <h3 className="card-title">{pr.title}</h3>
      <div className="card-meta">
        <span className="card-number">#{pr.number}</span>
        <span className="card-separator">•</span>
        <span className="card-updated">Updated {formatDate(pr.updatedAt)}</span>
        {pr.commentsCount > 0 && (
          <>
            <span className="card-separator">•</span>
            <span className="card-comments">{pr.commentsCount} comments</span>
          </>
        )}
      </div>
    </div>
  );
};

