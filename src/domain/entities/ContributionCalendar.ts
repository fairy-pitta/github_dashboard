/**
 * Contribution calendar entity representing GitHub contribution data
 */
export interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

export class ContributionCalendar {
  constructor(
    public readonly totalContributions: number,
    public readonly weeks: Array<{
      contributionDays: ContributionDay[];
    }>
  ) {}

  static fromPlain(plain: {
    totalContributions: number;
    weeks: Array<{
      contributionDays: Array<{
        date: string;
        contributionCount: number;
        color: string;
      }>;
    }>;
  }): ContributionCalendar {
    return new ContributionCalendar(plain.totalContributions, plain.weeks);
  }
}

