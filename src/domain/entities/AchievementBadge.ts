/**
 * AchievementBadge entity representing a user achievement
 */
export type BadgeType =
  | 'weekly_pr_10'
  | 'monthly_pr_50'
  | 'monthly_commits_100'
  | 'weekly_reviews_5'
  | 'streak_7'
  | 'streak_30';

export class AchievementBadge {
  constructor(
    public readonly id: BadgeType,
    public readonly name: string,
    public readonly description: string,
    public readonly icon: string,
    public readonly achieved: boolean,
    public readonly achievedAt: Date | null,
    public readonly progress: number,
    public readonly target: number
  ) {}

  static fromPlain(plain: {
    id: BadgeType;
    name: string;
    description: string;
    icon: string;
    achieved: boolean;
    achievedAt: string | Date | null;
    progress: number;
    target: number;
  }): AchievementBadge {
    const achievedAt =
      plain.achievedAt === null
        ? null
        : plain.achievedAt instanceof Date
          ? plain.achievedAt
          : new Date(plain.achievedAt);

    return new AchievementBadge(
      plain.id,
      plain.name,
      plain.description,
      plain.icon,
      plain.achieved,
      achievedAt,
      plain.progress,
      plain.target
    );
  }
}

