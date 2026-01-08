/**
 * User entity representing a GitHub user
 */
export class User {
  constructor(
    public readonly login: string,
    public readonly name: string | null,
    public readonly avatarUrl: string | null,
    public readonly bio: string | null = null,
    public readonly followers: number = 0,
    public readonly following: number = 0,
    public readonly repositories: number = 0,
    public readonly starredRepositories: number = 0,
    public readonly location: string | null = null,
    public readonly websiteUrl: string | null = null,
    public readonly company: string | null = null,
    public readonly twitterUsername: string | null = null,
    public readonly organizations: Array<{ login: string; name: string | null; avatarUrl: string | null }> = []
  ) {}

  static fromPlain(plain: {
    login: string;
    name?: string | null;
    avatarUrl?: string | null;
    bio?: string | null;
    followers?: number;
    following?: number;
    repositories?: number;
    starredRepositories?: number;
    location?: string | null;
    websiteUrl?: string | null;
    company?: string | null;
    twitterUsername?: string | null;
    organizations?: Array<{ login: string; name: string | null; avatarUrl: string | null }>;
  }): User {
    return new User(
      plain.login,
      plain.name ?? null,
      plain.avatarUrl ?? null,
      plain.bio ?? null,
      plain.followers ?? 0,
      plain.following ?? 0,
      plain.repositories ?? 0,
      plain.starredRepositories ?? 0,
      plain.location ?? null,
      plain.websiteUrl ?? null,
      plain.company ?? null,
      plain.twitterUsername ?? null,
      plain.organizations ?? []
    );
  }
}


