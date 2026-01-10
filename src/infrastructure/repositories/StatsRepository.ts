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

    const [calendar, prsResult, reviewedPRsResult, commentedPRsResult, issuesResult] = await Promise.all([
      this.calendarRepository.getCalendar(oneYearAgo.toISOString(), now.toISOString()),
      this.prRepository.getCreatedByMe(100),
      this.prRepository.getReviewedByMe(100),
      this.prRepository.getCommentedByMe(100),
      this.issueRepository.getInvolved(100),
    ]);

    // Use GetStatsData use case to calculate stats
    const getStatsDataUseCase = new GetStatsData();
    return getStatsDataUseCase.execute({
      calendar,
      pullRequests: prsResult.prs,
      reviewedPRs: reviewedPRsResult.prs,
      commentedPRs: commentedPRsResult.prs,
      issues: issuesResult.issues,
    });
  }
}

