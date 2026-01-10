import { StatsData, PeriodStats } from '../entities/StatsData';
import { ContributionCalendar } from '../entities/ContributionCalendar';
import { PullRequest } from '../entities/PullRequest';
import { Issue } from '../entities/Issue';

export interface StatsInput {
  calendar: ContributionCalendar;
  pullRequests: PullRequest[];
  reviewedPRs: PullRequest[];
  commentedPRs: PullRequest[];
  issues: Issue[];
}

/**
 * Use case: Get stats data
 * Calculates weekly and monthly statistics with comparisons
 */
export class GetStatsData {
  execute(input: StatsInput): StatsData {
    const now = new Date();

    // Calculate week boundaries
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay());
    currentWeekStart.setHours(0, 0, 0, 0);

    const previousWeekStart = new Date(currentWeekStart);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);
    const previousWeekEnd = new Date(currentWeekStart);
    previousWeekEnd.setMilliseconds(previousWeekEnd.getMilliseconds() - 1);

    // Calculate month boundaries
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    currentMonthStart.setHours(0, 0, 0, 0);

    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    previousMonthStart.setHours(0, 0, 0, 0);
    const previousMonthEnd = new Date(currentMonthStart);
    previousMonthEnd.setMilliseconds(previousMonthEnd.getMilliseconds() - 1);

    // Calculate current week stats
    const currentWeek = this.calculatePeriodStats(
      input,
      currentWeekStart,
      now
    );

    // Calculate previous week stats
    const previousWeek = this.calculatePeriodStats(
      input,
      previousWeekStart,
      previousWeekEnd
    );

    // Calculate current month stats
    const currentMonth = this.calculatePeriodStats(
      input,
      currentMonthStart,
      now
    );

    // Calculate previous month stats
    const previousMonth = this.calculatePeriodStats(
      input,
      previousMonthStart,
      previousMonthEnd
    );

    return StatsData.fromPlain({
      currentWeek,
      previousWeek,
      currentMonth,
      previousMonth,
    });
  }

  private calculatePeriodStats(
    input: StatsInput,
    startDate: Date,
    endDate: Date
  ): PeriodStats {
    // Count commits from contribution calendar
    let commits = 0;
    input.calendar.weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        const dayDate = new Date(day.date);
        if (dayDate >= startDate && dayDate <= endDate) {
          commits += day.contributionCount;
        }
      });
    });

    // Count pull requests by createdAt
    const pullRequests = input.pullRequests.filter((pr) => {
      return pr.createdAt >= startDate && pr.createdAt <= endDate;
    }).length;

    // Count issues
    const issues = input.issues.filter((issue) => {
      return issue.updatedAt >= startDate && issue.updatedAt <= endDate;
    }).length;

    // Count reviews (PRs reviewed by the user) by updatedAt
    const reviews = input.reviewedPRs.filter((pr) => {
      return pr.updatedAt >= startDate && pr.updatedAt <= endDate;
    }).length;

    // Count comments (PRs the user has commented on) by updatedAt
    const comments = input.commentedPRs.filter((pr) => {
      return pr.updatedAt >= startDate && pr.updatedAt <= endDate;
    }).length;

    return {
      commits,
      pullRequests,
      reviews,
      issues,
      comments,
    };
  }
}

