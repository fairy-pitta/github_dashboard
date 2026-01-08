import React from 'react';
import { Repository } from '@/domain/entities/Repository';
import './styles/cards.css';

interface RepositoryCardProps {
  repository: Repository;
  onClick?: () => void;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({
  repository,
  onClick,
}) => {
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
      window.open(repository.url, '_blank');
    }
  };

  return (
    <div className="card repository-card" onClick={handleClick}>
      <div className="card-header">
        <span className={`badge ${repository.isPrivate ? 'badge-private' : 'badge-public'}`}>
          {repository.isPrivate ? 'Private' : 'Public'}
        </span>
        <span className="card-repo">{repository.nameWithOwner}</span>
      </div>
      {repository.description && (
        <p className="card-description">{repository.description}</p>
      )}
      <div className="card-meta">
        <span className="card-updated">Updated {formatDate(repository.updatedAt)}</span>
      </div>
    </div>
  );
};

