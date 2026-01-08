import React from 'react';
import { Issue } from '@/domain/entities/Issue';
import './styles/cards.css';

interface IssueCardProps {
  issue: Issue;
  onClick?: () => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onClick }) => {
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
      window.open(issue.url, '_blank');
    }
  };

  return (
    <div className="card issue-card" onClick={handleClick}>
      <div className="card-header">
        <span className={`badge ${issue.state === 'OPEN' ? 'badge-open' : 'badge-closed'}`}>
          {issue.state}
        </span>
        <span className="card-repo">{issue.repository.nameWithOwner}</span>
      </div>
      <h3 className="card-title">{issue.title}</h3>
      {issue.labels.length > 0 && (
        <div className="card-labels">
          {issue.labels.map((label) => (
            <span
              key={label.name}
              className="label"
              style={{ backgroundColor: `#${label.color}` }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}
      <div className="card-meta">
        <span className="card-number">#{issue.number}</span>
        <span className="card-separator">•</span>
        <span className="card-updated">Updated {formatDate(issue.updatedAt)}</span>
        {issue.commentsCount > 0 && (
          <>
            <span className="card-separator">•</span>
            <span className="card-comments">{issue.commentsCount} comments</span>
          </>
        )}
        {issue.assignees.length > 0 && (
          <>
            <span className="card-separator">•</span>
            <span className="card-assignees">
              {issue.assignees.length} assignee{issue.assignees.length > 1 ? 's' : ''}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

