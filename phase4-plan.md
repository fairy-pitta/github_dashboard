# Phase 4: New Tab Page UI Implementation

## Purpose
Implement the New Tab page UI and display PR, Issue, and Repository sections.

## Repository
GitHub Repository: https://github.com/fairy-pitta/github_extension.git

## Clean Architecture Layer

This phase focuses on the implementation of the **Presentation layer (New Tab)**.

## Implementation Tasks

### 1. New Tab Page Basic Structure
- [ ] Create `src/presentation/newtab/NewTabApp.tsx`
  - Main app component
  - State management (loading, error, data)
  - Refresh functionality
- [ ] Create `src/presentation/newtab/hooks/useDashboardData.ts`
  - Data retrieval using DashboardService
  - Cache management
  - Error handling
- [ ] Create `src/presentation/newtab/hooks/useAuth.ts`
  - Authentication state management
  - PAT retrieval and validation

### 2. Shared Components
- [ ] Create `src/presentation/components/LoadingSpinner.tsx`
  - Loading display
- [ ] Create `src/presentation/components/ErrorMessage.tsx`
  - Error message display
  - Retry button
- [ ] Create `src/presentation/components/RefreshButton.tsx`
  - Refresh button
- [ ] Create `src/presentation/components/FilterToggle.tsx`
  - Filter toggle (All / Open Only)

### 3. PR Section Implementation
- [ ] Create `src/presentation/components/PRSection.tsx`
  - PR list display
  - Title, state, updated timestamp
  - Repository name display
- [ ] Create `src/presentation/components/PRCard.tsx`
  - Individual PR card
  - State badge (Open, Closed, Draft, etc.)
  - Opens GitHub page on click
- [ ] Create `src/presentation/components/CreatedPRSection.tsx`
  - "PRs Created by Me" section
- [ ] Create `src/presentation/components/ReviewRequestedPRSection.tsx`
  - "PRs with Review Requested" section

### 4. Issue Section Implementation
- [ ] Create `src/presentation/components/IssueSection.tsx`
  - Issue list display
- [ ] Create `src/presentation/components/IssueCard.tsx`
  - Individual Issue card
  - State badge
  - Label display (optional)

### 5. Repository Section Implementation
- [ ] Create `src/presentation/components/RepositorySection.tsx`
  - Repository list display
  - Pagination support
- [ ] Create `src/presentation/components/RepositoryCard.tsx`
  - Individual Repository card
  - Updated timestamp display
  - Private/public display
- [ ] Create `src/presentation/components/LoadMoreButton.tsx`
  - "Load More" button
  - Pagination processing

### 6. Layout Implementation
- [ ] Create `src/presentation/newtab/components/DashboardLayout.tsx`
  - Grid layout
  - Section placement
- [ ] Create `src/presentation/newtab/components/Header.tsx`
  - Title
  - Refresh button
  - Filter toggle
  - Settings link

### 7. Styling
- [ ] Create `src/presentation/newtab/styles/newtab.css`
  - Modern UI design
  - Responsive support
  - Dark mode support (optional)
- [ ] Create `src/presentation/components/styles/cards.css`
  - Card component styles

### 8. Authentication Check
- [ ] Create `src/presentation/newtab/components/AuthGuard.tsx`
  - Display when PAT is not set
  - Link to Options page

## Test Items

### Unit Tests
- [ ] `useDashboardData` hook tests
  - Data retrieval tests
  - Cache usage tests
  - Error handling tests
- [ ] `useAuth` hook tests
  - Authentication state tests
- [ ] Section component tests
  - `CreatedPRSection` tests
  - `ReviewRequestedPRSection` tests
  - `IssueSection` tests
  - `RepositorySection` tests (pagination)
- [ ] Card component tests
  - `PRCard` tests
  - `IssueCard` tests
  - `RepositoryCard` tests

### Integration Tests
- [ ] New Tab page integration tests
  - Data retrieval → display verification
  - Filter toggle tests
  - Pagination tests
  - Refresh tests

### Test Files
- [ ] `src/presentation/newtab/hooks/__tests__/useDashboardData.test.ts`
- [ ] `src/presentation/newtab/hooks/__tests__/useAuth.test.ts`
- [ ] `src/presentation/components/__tests__/PRSection.test.tsx`
- [ ] `src/presentation/components/__tests__/IssueSection.test.tsx`
- [ ] `src/presentation/components/__tests__/RepositorySection.test.tsx`
- [ ] `src/presentation/newtab/__tests__/NewTabApp.test.tsx`

## Deliverables

- New Tab page UI (PR, Issue, Repository sections)
- Shared components (Loading, Error, Cards, etc.)
- Pagination functionality
- Filter functionality (All / Open Only)
- Refresh functionality
- Authentication guard

## GitHub Commit

```bash
git add .
git commit -m "feat: Phase 4 - New Tab page UI implementation

- New Tab page main UI implementation
- PR sections (created/review requested) implementation
- Issue section implementation
- Repository section implementation (pagination support)
- Shared components (Loading, Error, Cards) implementation
- Filter functionality (All / Open Only) implementation
- Refresh functionality implementation
- Authentication guard implementation
- New Tab page unit tests and integration tests added"
```
