import { IStatsRepository } from '@/domain/repositories/IStatsRepository';
import { StatsData } from '@/domain/entities/StatsData';
import { ContributionCalendarRepository } from './ContributionCalendarRepository';
import { PullRequestRepository } from './PullRequestRepository';
import { IssueRepository } from './IssueRepository';
import { GetStatsData } from '@/domain/usecases/GetStatsData';

/**
 * StatsRepository implementation
 */
export class StatsRepository implements IStatsRepository {
  constructor(
    private readonly graphqlClient: GitHubGraphQLClient,
    private readonly calendarRepository: ContributionCalendarRepository,
    private readonly prRepository: PullRequestRepository,
    private readonly issueRepository: IssueRepository
  ) {}

  async getStatsData(): Promise<StatsData> {
    // Get contribution calendar
    const now = new Date();
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(now.getFullYear() - 1);
    oneYearAgo.setHours(0, 0, 0, 0);
    now.setHours(23, 59, 59, 999);

    const calendar = await this.calendarRepository.getCalendar(
      oneYearAgo.toISOString(),
      now.toISOString()
    );

    // Get pull requests (limit to 100 for stats calculation)
    const prsResult = await this.prRepository.getCreatedByMe(100);
    const pullRequests = prsResult.prs;

    // Get issues (limit to 100 for stats calculation)
    const issuesResult = await this.issueRepository.getInvolved(100);
    const issues = issuesResult.issues;

    // Get reviews count
    // Note: This is a simplified implementation. In a real scenario,
    // we would need to fetch reviews with proper date filtering.
    // For now, we'll use 0 as reviews are not easily queryable via GraphQL search.
    // This can be enhanced in the future with a dedicated reviews query.
    const reviewsCount = 0;

    // Use GetStatsData use case to calculate stats
    const getStatsDataUseCase = new GetStatsData();
    return getStatsDataUseCase.execute({
      calendar,
      pullRequests,
      issues,
      reviews: reviewsCount,
    });
  }
}

