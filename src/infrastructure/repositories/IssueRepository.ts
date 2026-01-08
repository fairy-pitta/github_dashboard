import { Issue } from '@/domain/entities/Issue';
import { IIssueRepository } from '@/domain/repositories/IIssueRepository';
import { GitHubGraphQLClient } from '../api/GitHubGraphQLClient';
import { IssueMapper } from '../api/mappers/IssueMapper';

const ISSUES_QUERY = `
  query GetInvolvedIssues($limit: Int!, $cursor: String) {
    involvedIssues: search(
      query: "is:issue involves:@me archived:false sort:updated-desc"
      type: ISSUE
      first: $limit
      after: $cursor
    ) {
      nodes {
        ... on Issue {
          number
          title
          state
          url
          updatedAt
          repository {
            nameWithOwner
            url
            updatedAt
            isPrivate
            description
            owner {
              __typename
              login
              ... on User {
                name
                avatarUrl
              }
              ... on Organization {
                name
                avatarUrl
              }
            }
          }
          comments {
            totalCount
          }
          assignees(first: 10) {
            nodes {
              login
              ... on User {
                name
              }
              avatarUrl
            }
          }
          labels(first: 10) {
            nodes {
              name
              color
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

interface IssuesResponse {
  involvedIssues: {
    nodes: IssueMapper.GraphQLIssue[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}

/**
 * IssueRepository implementation
 */
export class IssueRepository implements IIssueRepository {
  constructor(private readonly graphqlClient: GitHubGraphQLClient) {}

  async getInvolved(limit: number, cursor?: string): Promise<{ issues: Issue[]; nextCursor?: string }> {
    const response = await this.graphqlClient.query<IssuesResponse>(
      ISSUES_QUERY,
      { limit, cursor: cursor ?? null }
    );

    const issues = response.involvedIssues?.nodes ?? [];
    const pageInfo = response.involvedIssues?.pageInfo;
    const nextCursor = pageInfo?.hasNextPage && pageInfo?.endCursor
      ? pageInfo.endCursor
      : undefined;

    return {
      issues: IssueMapper.toDomainArray(issues),
      nextCursor,
    };
  }
}
