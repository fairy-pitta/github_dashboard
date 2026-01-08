/**
 * ContributionDay entity representing a single day's contribution data
 */
export class ContributionDay {
  constructor(
    public readonly date: string,
    public readonly contributionCount: number,
    public readonly color: string
  ) {}

  static fromPlain(plain: {
    date: string;
    contributionCount: number;
    color: string;
  }): ContributionDay {
    return new ContributionDay(plain.date, plain.contributionCount, plain.color);
  }
}

