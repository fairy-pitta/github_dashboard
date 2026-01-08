import { useState, useEffect, useCallback } from 'react';
import { DashboardData } from '@/domain/usecases/GetDashboardData';
import { Container } from '@/application/di/Container';
import { NetworkError } from '@/domain/errors/DomainError';

export interface DashboardDataState {
  data: DashboardData | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook for dashboard data retrieval
 */
export function useDashboardData(
  limit: number = 10,
  filterOpenOnly: boolean = false
): DashboardDataState & { refresh: () => Promise<void> } {
  const [state, setState] = useState<DashboardDataState>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(
    async (forceRefresh: boolean = false) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const container = Container.getInstance();
        const dashboardService = container.getDashboardService();

        let data = await dashboardService.getDashboardData(limit, forceRefresh);

        // Apply filter if needed
        if (filterOpenOnly) {
          data = {
            ...data,
            createdPRs: data.createdPRs.filter((pr) => pr.state === 'OPEN'),
            reviewRequestedPRs: data.reviewRequestedPRs.filter(
              (pr) => pr.state === 'OPEN'
            ),
            involvedIssues: data.involvedIssues.filter(
              (issue) => issue.state === 'OPEN'
            ),
          };
        }

        setState({
          data,
          loading: false,
          error: null,
        });
      } catch (error) {
        // If it's a network error and we have cached data, use it
        if (error instanceof NetworkError && state.data) {
          setState({
            data: state.data,
            loading: false,
            error: null,
          });
        } else {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error : new Error('Unknown error'),
          });
        }
      }
    },
    [limit, filterOpenOnly, state.data]
  );

  useEffect(() => {
    fetchData(false);
  }, [fetchData]);

  const refresh = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  return {
    ...state,
    refresh,
  };
}

