import { User } from '@/domain/entities/User';

export interface GraphQLUser {
  login: string;
  name?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  followers?: { totalCount: number };
  following?: { totalCount: number };
  repositories?: { totalCount: number };
  starredRepositories?: { totalCount: number };
  location?: string | null;
  websiteUrl?: string | null;
  company?: string | null;
  twitterUsername?: string | null;
  organizations?: {
    nodes: Array<{
      login: string;
      name?: string | null;
      avatarUrl?: string | null;
    }>;
  };
}

/**
 * Maps GraphQL user response to User entity
 */
export class UserMapper {
  static toDomain(graphql: GraphQLUser): User {
    return User.fromPlain({
      login: graphql.login,
      name: graphql.name ?? null,
      avatarUrl: graphql.avatarUrl ?? null,
      bio: graphql.bio ?? null,
      followers: graphql.followers?.totalCount ?? 0,
      following: graphql.following?.totalCount ?? 0,
      repositories: graphql.repositories?.totalCount ?? 0,
      starredRepositories: graphql.starredRepositories?.totalCount ?? 0,
      location: graphql.location ?? null,
      websiteUrl: graphql.websiteUrl ?? null,
      company: graphql.company ?? null,
      twitterUsername: graphql.twitterUsername ?? null,
      organizations: graphql.organizations?.nodes.map((org) => ({
        login: org.login,
        name: org.name ?? null,
        avatarUrl: org.avatarUrl ?? null,
      })) ?? [],
    });
  }
}


