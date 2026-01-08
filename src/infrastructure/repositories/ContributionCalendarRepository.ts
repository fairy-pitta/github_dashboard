import { ContributionCalendar } from '@/domain/entities/ContributionCalendar';
import { IContributionCalendarRepository } from '@/domain/repositories/IContributionCalendarRepository';
import { GitHubGraphQLClient } from '../api/GitHubGraphQLClient';

const CONTRIBUTION_CALENDAR_QUERY = `
  query GetContributionCalendar($from: DateTime!, $to: DateTime!) {
    viewer {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }
`;

interface ContributionCalendarResponse {
  viewer: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number;
        weeks: Array<{
          contributionDays: Array<{
            date: string;
            contributionCount: number;
            color: string;
          }>;
        }>;
      };
    };
  };
}

/**
 * ContributionCalendarRepository implementation
 */
export class ContributionCalendarRepository implements IContributionCalendarRepository {
  constructor(private readonly graphqlClient: GitHubGraphQLClient) {}

  async getCalendar(from: string, to: string): Promise<ContributionCalendar> {
    const response = await this.graphqlClient.query<ContributionCalendarResponse>(
      CONTRIBUTION_CALENDAR_QUERY,
      { from, to }
    );

    const collection = response.viewer.contributionsCollection;
    
    if (!collection || !collection.contributionCalendar) {
      throw new Error('No contribution calendar data returned from API');
    }

    const calendar = collection.contributionCalendar;

    return ContributionCalendar.fromPlain({
      totalContributions: calendar.totalContributions || 0,
      weeks: calendar.weeks || [],
    });
  }
}

