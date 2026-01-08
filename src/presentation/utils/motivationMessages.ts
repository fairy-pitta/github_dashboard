/**
 * Motivation message utilities
 * Provides logic to select appropriate motivation messages based on time of day and activity
 */

export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

export interface ActivityContext {
  prCount: number;
  reviewRequestedCount: number;
  issueCount: number;
  streakDays: number;
}

export type MessageCategory = 'pr' | 'review' | 'issue' | 'streak' | 'time' | 'default';

/**
 * Get time of day based on current hour
 * Morning: 5-11, Afternoon: 12-17, Evening: 18-4
 */
export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 18) {
    return 'afternoon';
  } else {
    return 'evening';
  }
}

/**
 * Determine message category based on activity context
 */
export function getMessageCategory(context: ActivityContext): MessageCategory {
  // Prioritize based on activity levels
  if (context.streakDays >= 7) {
    return 'streak';
  }
  
  if (context.reviewRequestedCount >= 3) {
    return 'review';
  }
  
  if (context.prCount >= 3) {
    return 'pr';
  }
  
  if (context.issueCount >= 3) {
    return 'issue';
  }
  
  // Use time-based messages as default if no significant activity
  return 'time';
}

/**
 * Select a random message from an array of messages
 */
export function selectRandomMessage<T>(messages: T[]): T {
  if (messages.length === 0) {
    throw new Error('Messages array cannot be empty');
  }
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

/**
 * Get motivation message from translations based on category and time of day
 */
export function getMotivationMessage(
  messages: {
    pr: { morning: string[]; afternoon: string[]; evening: string[]; default: string[] };
    review: { morning: string[]; afternoon: string[]; evening: string[]; default: string[] };
    issue: { morning: string[]; afternoon: string[]; evening: string[]; default: string[] };
    streak: { morning: string[]; afternoon: string[]; evening: string[]; default: string[] };
    time: { morning: string[]; afternoon: string[]; evening: string[] };
    default: string[];
  },
  category: MessageCategory,
  timeOfDay: TimeOfDay
): string {
  let messagePool: string[] = [];
  
  if (category === 'time') {
    messagePool = messages.time[timeOfDay];
  } else if (category === 'pr') {
    messagePool = [
      ...messages.pr[timeOfDay],
      ...messages.pr.default,
    ];
  } else if (category === 'review') {
    messagePool = [
      ...messages.review[timeOfDay],
      ...messages.review.default,
    ];
  } else if (category === 'issue') {
    messagePool = [
      ...messages.issue[timeOfDay],
      ...messages.issue.default,
    ];
  } else if (category === 'streak') {
    messagePool = [
      ...messages.streak[timeOfDay],
      ...messages.streak.default,
    ];
  } else {
    messagePool = messages.default;
  }
  
  // If no messages found, use default
  if (messagePool.length === 0) {
    messagePool = messages.default;
  }
  
  return selectRandomMessage(messagePool);
}

