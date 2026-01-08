# Phase 2: Infrastructure Layer Implementation

## Purpose
Implement GitHub API client, Chrome Storage implementation, and cache functionality to concretize domain layer interfaces.

## Repository
GitHub Repository: https://github.com/fairy-pitta/github_extension.git

## Clean Architecture Layer

This phase focuses on the implementation of the **Infrastructure layer**.

## Implementation Tasks

### 1. GitHub API Client Implementation
- [ ] Create `src/infrastructure/api/GitHubGraphQLClient.ts`
  - GraphQL query execution
  - Error handling (401, 403, 429, etc.)
  - Rate limit handling
- [ ] Create `src/infrastructure/api/GitHubRESTClient.ts`
  - REST API calls (as needed)
  - Error handling
- [ ] Create `src/infrastructure/api/queries/dashboard.graphql`
  - GraphQL queries for PRs (created), PRs (review requested), Issues, and Repos
- [ ] Create `src/infrastructure/api/queries/user.graphql`
  - User information retrieval query
- [ ] Create `src/infrastructure/api/mappers/` directory
  - `PullRequestMapper.ts` (GraphQL response → PullRequest entity)
  - `IssueMapper.ts` (GraphQL response → Issue entity)
  - `RepositoryMapper.ts` (GraphQL response → Repository entity)
  - `UserMapper.ts` (GraphQL response → User entity)

### 2. Repository Implementation (Infrastructure Layer)
- [ ] Create `src/infrastructure/repositories/PullRequestRepository.ts`
  - Implements `IPullRequestRepository`
  - Uses `GitHubGraphQLClient`
- [ ] Create `src/infrastructure/repositories/IssueRepository.ts`
  - Implements `IIssueRepository`
- [ ] Create `src/infrastructure/repositories/RepositoryRepository.ts`
  - Implements `IRepositoryRepository`
  - Org Repo integration logic (merging 2 Orgs)
  - Pagination support
- [ ] Create `src/infrastructure/repositories/AuthRepository.ts`
  - Implements `IAuthRepository`
  - Token validation

### 3. Chrome Storage Implementation
- [ ] Create `src/infrastructure/storage/IStorage.ts` (interface)
  - `get<T>(key: string): Promise<T | null>`
  - `set<T>(key: string, value: T): Promise<void>`
  - `remove(key: string): Promise<void>`
- [ ] Create `src/infrastructure/storage/ChromeStorage.ts`
  - Wrapper implementation for `chrome.storage.local`
  - Implements `IStorage`
- [ ] Create `src/infrastructure/storage/StorageKeys.ts`
  - Storage key constant definitions (`PAT_TOKEN`, `CACHE_*`, etc.)

### 4. Cache Implementation
- [ ] Create `src/infrastructure/cache/ICache.ts` (interface)
  - `get<T>(key: string): Promise<T | null>`
  - `set<T>(key: string, value: T, ttl: number): Promise<void>`
  - `clear(): Promise<void>`
- [ ] Create `src/infrastructure/cache/MemoryCache.ts`
  - Memory-based cache (TTL support)
  - Persists using `IStorage`
- [ ] Create `src/infrastructure/cache/CacheKeys.ts`
  - Cache key constant definitions

### 5. Error Handling
- [ ] Create `src/infrastructure/api/errors/ApiError.ts`
  - Converts GitHub API errors to domain errors
  - 401 → `AuthenticationError`
  - 403 → `PermissionError`
  - 429 → `RateLimitError`
  - Network errors → `NetworkError`

## Test Items

### Unit Tests
- [ ] `GitHubGraphQLClient` tests
  - Success cases (mocked responses)
  - Error cases (401, 403, 429, network errors)
- [ ] Mapper tests
  - `PullRequestMapper` tests
  - `IssueMapper` tests
  - `RepositoryMapper` tests
- [ ] Repository implementation tests
  - `PullRequestRepository` tests (mocked API client)
  - `IssueRepository` tests
  - `RepositoryRepository` tests (Org integration logic)
  - `AuthRepository` tests
- [ ] `ChromeStorage` tests
  - get/set/remove tests
- [ ] `MemoryCache` tests
  - TTL tests
  - Cache clear tests

### Integration Tests
- [ ] GitHub API integration tests (actual API calls, test token required)
  - GraphQL query execution tests
  - Error response handling tests

### Test Files
- [ ] `src/infrastructure/api/__tests__/GitHubGraphQLClient.test.ts`
- [ ] `src/infrastructure/api/mappers/__tests__/PullRequestMapper.test.ts`
- [ ] `src/infrastructure/api/mappers/__tests__/IssueMapper.test.ts`
- [ ] `src/infrastructure/api/mappers/__tests__/RepositoryMapper.test.ts`
- [ ] `src/infrastructure/repositories/__tests__/PullRequestRepository.test.ts`
- [ ] `src/infrastructure/repositories/__tests__/RepositoryRepository.test.ts`
- [ ] `src/infrastructure/storage/__tests__/ChromeStorage.test.ts`
- [ ] `src/infrastructure/cache/__tests__/MemoryCache.test.ts`

## Deliverables

- GitHub API client (GraphQL/REST)
- Repository implementations (concretization of domain interfaces)
- Chrome Storage implementation
- Cache functionality (TTL support)
- Error handling (API error → domain error conversion)

## GitHub Commit

```bash
git add .
git commit -m "feat: Phase 2 - Infrastructure layer implementation

- GitHub GraphQL/REST API client implementation
- Repository implementations (PullRequestRepository, IssueRepository, etc.)
- Chrome Storage implementation and cache functionality (TTL support)
- API response → entity mapper implementations
- Error handling (API error → domain error conversion)
- Org Repo integration logic implementation
- Infrastructure layer unit tests added"
```
