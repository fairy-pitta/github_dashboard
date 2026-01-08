import React, { useState } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { Header } from './components/Header';
import { AuthGuard } from './components/AuthGuard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { CreatedPRSection } from '../components/CreatedPRSection';
import { ReviewRequestedPRSection } from '../components/ReviewRequestedPRSection';
import { IssueSection } from '../components/IssueSection';
import { RepositorySection } from '../components/RepositorySection';
import { useAuth } from './hooks/useAuth';
import { useDashboardData } from './hooks/useDashboardData';
import './styles/newtab.css';

export const NewTabApp: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [filter, setFilter] = useState<'all' | 'open'>('all');
  const {
    data,
    loading: dataLoading,
    error,
    refresh,
  } = useDashboardData(10, filter === 'open');

  if (authLoading) {
    return (
      <div className="dashboard-container">
        <LoadingSpinner size="large" message="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthGuard />;
  }

  const handleRefresh = async () => {
    await refresh();
  };

  return (
    <div className="dashboard-container">
      <Header
        onRefresh={handleRefresh}
        refreshing={dataLoading}
        filter={filter}
        onFilterChange={setFilter}
      />

      {error && (
        <ErrorMessage error={error} onRetry={handleRefresh} />
      )}

      {dataLoading && !data ? (
        <LoadingSpinner size="large" message="Loading dashboard data..." />
      ) : (
        <DashboardLayout>
          <CreatedPRSection prs={data?.createdPRs ?? []} loading={dataLoading} />
          <ReviewRequestedPRSection
            prs={data?.reviewRequestedPRs ?? []}
            loading={dataLoading}
          />
          <IssueSection issues={data?.involvedIssues ?? []} loading={dataLoading} />
          <RepositorySection
            repositories={data?.recentlyUpdatedRepos ?? []}
            loading={dataLoading}
          />
        </DashboardLayout>
      )}
    </div>
  );
};

