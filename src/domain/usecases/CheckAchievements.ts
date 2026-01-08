import { AchievementBadge, BadgeType } from '../entities/AchievementBadge';
import { ContributionCalendar } from '../entities/ContributionCalendar';
import { PullRequest } from '../entities/PullRequest';
import { CalculateStreak } from './CalculateStreak';

export interface AchievementCheckInput {
  calendar: ContributionCalendar;
  pullRequests: PullRequest[];
  reviews: number;
}

/**
 * Use case: Check achievements
 * Checks which achievements have been unlocked based on user activity
 */
export class CheckAchievements {
  private readonly badgeDefinitions: Array<{
    id: BadgeType;
    name: string;
    description: string;
    icon: string;
    check: (input: AchievementCheckInput, streak: number) => { achieved: boolean; progress: number; target: number };
  }> = [
    {
      id: 'weekly_pr_10',
      name: 'PR Master',
      description: '今週10個のPRを作成',
      icon: 'fa-code-branch',
      check: (input) => {
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);

        const weeklyPRs = input.pullRequests.filter((pr) => {
          const createdAt = pr.createdAt;
          return createdAt >= weekStart;
        }).length;

        return {
          achieved: weeklyPRs >= 10,
          progress: weeklyPRs,
          target: 10,
        };
      },
    },
    {
      id: 'monthly_pr_50',
      name: 'PR Champion',
      description: '今月50個のPRを作成',
      icon: 'fa-trophy',
      check: (input) => {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        monthStart.setHours(0, 0, 0, 0);

        const monthlyPRs = input.pullRequests.filter((pr) => {
          const createdAt = pr.createdAt;
          return createdAt >= monthStart;
        }).length;

        return {
          achieved: monthlyPRs >= 50,
          progress: monthlyPRs,
          target: 50,
        };
      },
    },
    {
      id: 'monthly_commits_100',
      name: 'Commit King',
      description: '今月100回のコミット',
      icon: 'fa-fire',
      check: (input) => {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        monthStart.setHours(0, 0, 0, 0);

        let monthlyCommits = 0;
        input.calendar.weeks.forEach((week) => {
          week.contributionDays.forEach((day) => {
            const dayDate = new Date(day.date);
            if (dayDate >= monthStart) {
              monthlyCommits += day.contributionCount;
            }
          });
        });

        return {
          achieved: monthlyCommits >= 100,
          progress: monthlyCommits,
          target: 100,
        };
      },
    },
    {
      id: 'weekly_reviews_5',
      name: 'Review Helper',
      description: '今週5回のレビュー',
      icon: 'fa-eye',
      check: (input) => {
        return {
          achieved: input.reviews >= 5,
          progress: input.reviews,
          target: 5,
        };
      },
    },
    {
      id: 'streak_7',
      name: 'Week Warrior',
      description: '連続7日コントリビュート',
      icon: 'fa-calendar-week',
      check: (input, streak) => {
        return {
          achieved: streak >= 7,
          progress: streak,
          target: 7,
        };
      },
    },
    {
      id: 'streak_30',
      name: 'Month Master',
      description: '連続30日コントリビュート',
      icon: 'fa-calendar-alt',
      check: (input, streak) => {
        return {
          achieved: streak >= 30,
          progress: streak,
          target: 30,
        };
      },
    },
  ];

  execute(input: AchievementCheckInput): AchievementBadge[] {
    const streakCalculator = new CalculateStreak();
    const streak = streakCalculator.execute(input.calendar);

    return this.badgeDefinitions.map((def) => {
      const result = def.check(input, streak.currentStreak);
      return AchievementBadge.fromPlain({
        id: def.id,
        name: def.name,
        description: def.description,
        icon: def.icon,
        achieved: result.achieved,
        achievedAt: result.achieved ? new Date() : null,
        progress: result.progress,
        target: result.target,
      });
    });
  }
}

