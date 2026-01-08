# Phase 1: Domain Layer and Entity Definitions

## Purpose
Implement the domain layer of Clean Architecture and define entities and repository interfaces that represent GitHub data.

## Repository
GitHub Repository: https://github.com/fairy-pitta/github_extension.git

## Clean Architecture Layer

This phase focuses on the implementation of the **Domain layer**.

## Implementation Tasks

### 1. Entity Definitions
- [ ] Create `src/domain/entities/PullRequest.ts`
  - number, title, state, url, updatedAt
  - repository (nameWithOwner)
  - reviewDecision, commentsCount
  - author, reviewers
- [ ] Create `src/domain/entities/Issue.ts`
  - number, title, state, url, updatedAt
  - repository (nameWithOwner)
  - commentsCount
  - assignees, labels
- [ ] Create `src/domain/entities/Repository.ts`
  - nameWithOwner, url, updatedAt
  - isPrivate, description
  - owner (personal/Org)
- [ ] Create `src/domain/entities/User.ts`
  - login, name, avatarUrl
- [ ] Create `src/domain/entities/Organization.ts`
  - login, name, avatarUrl
- [ ] Create `src/domain/entities/index.ts` (exports)

### 2. Repository Interface Definitions
- [ ] Create `src/domain/repositories/IPullRequestRepository.ts`
  - `getCreatedByMe(limit: number): Promise<PullRequest[]>`
  - `getReviewRequested(limit: number): Promise<PullRequest[]>`
  - `getReviewedByMe(limit: number): Promise<PullRequest[]>` (for future use)
- [ ] Create `src/domain/repositories/IIssueRepository.ts`
  - `getInvolved(limit: number): Promise<Issue[]>`
- [ ] Create `src/domain/repositories/IRepositoryRepository.ts`
  - `getRecentlyUpdated(limit: number, cursor?: string): Promise<{ repositories: Repository[], nextCursor?: string }>`
  - `getByOrganizations(orgLogins: string[], limit: number): Promise<Repository[]>`
- [ ] Create `src/domain/repositories/IAuthRepository.ts`
  - `validateToken(token: string): Promise<User>`
  - `getCurrentUser(): Promise<User>`
- [ ] Create `src/domain/repositories/index.ts` (exports)

### 3. Use Case Definitions
- [ ] Create `src/domain/usecases/GetDashboardData.ts`
  - Integrated retrieval of PRs (created), PRs (review requested), Issues, and Repos
  - Receives repositories via dependency injection
- [ ] Create `src/domain/usecases/ValidateToken.ts`
  - PAT validation
- [ ] Create `src/domain/usecases/index.ts` (exports)

### 4. Domain Error Definitions
- [ ] Create `src/domain/errors/DomainError.ts`
  - `AuthenticationError`
  - `RateLimitError`
  - `NetworkError`
  - `PermissionError`

## Test Items

### Unit Tests
- [ ] Entity creation and validation tests
  - `PullRequest` entity tests
  - `Issue` entity tests
  - `Repository` entity tests
- [ ] Use case tests (using mocked repositories)
  - `GetDashboardData` tests
  - `ValidateToken` tests
- [ ] Domain error tests

### Test Files
- [ ] `src/domain/entities/__tests__/PullRequest.test.ts`
- [ ] `src/domain/entities/__tests__/Issue.test.ts`
- [ ] `src/domain/entities/__tests__/Repository.test.ts`
- [ ] `src/domain/usecases/__tests__/GetDashboardData.test.ts`
- [ ] `src/domain/usecases/__tests__/ValidateToken.test.ts`

## Deliverables

- Domain entities (PR, Issue, Repository, User, Organization)
- Repository interfaces (Dependency Inversion Principle)
- Use cases (business logic)
- Domain error definitions

## GitHub Commit

```bash
git add .
git commit -m "feat: Phase 1 - Domain layer and entity definitions

- PullRequest, Issue, Repository, User, Organization entity definitions
- Repository interface definitions (IPullRequestRepository, IIssueRepository, etc.)
- Use case implementations (GetDashboardData, ValidateToken)
- Domain error definitions
- Unit tests for entities and use cases added"
```
