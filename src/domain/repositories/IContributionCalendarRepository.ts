import { ContributionCalendar } from '../entities/ContributionCalendar';

/**
 * Repository interface for ContributionCalendar operations
 */
export interface IContributionCalendarRepository {
  /**
   * Get contribution calendar for the current user
   * @param from Start date (ISO string)
   * @param to End date (ISO string)
   */
  getCalendar(from: string, to: string): Promise<ContributionCalendar>;
}

