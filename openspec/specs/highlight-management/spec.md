# Highlight Management Specification

## Purpose

Define authenticated, per-user CRUD operations for homepage highlights.

## Requirements

### Requirement: User-owned profile
The system SHALL associate highlights with the authenticated user's site profile. It SHALL create a default profile when the user does not yet have one.

#### Scenario: A user accesses highlights for the first time
- **WHEN** an authenticated user without a site profile requests or creates highlights
- **THEN** the system creates a default profile bound to that user before accessing highlights

### Requirement: Highlight listing
The system SHALL list only highlights owned by the authenticated user's profile, ordered by creation time ascending.

#### Scenario: An authenticated user lists highlights
- **WHEN** an authenticated user calls `GET /api/highlights`
- **THEN** the system returns that user's highlights ordered from oldest to newest

#### Scenario: An unauthenticated visitor lists highlights
- **WHEN** a visitor without a valid session calls `GET /api/highlights`
- **THEN** the system returns HTTP `401`

### Requirement: Highlight creation
The system SHALL allow an authenticated user to create a highlight with a non-empty trimmed title and summary.

#### Scenario: An authenticated user submits a valid highlight
- **WHEN** an authenticated user calls `POST /api/highlights` with a non-empty title and summary
- **THEN** the system creates the highlight under that user's profile and returns HTTP `201`

#### Scenario: A highlight title or summary is blank
- **WHEN** an authenticated user submits a blank title or summary
- **THEN** the system returns HTTP `400`

### Requirement: Highlight update
The system SHALL allow an authenticated user to update a highlight owned by their profile and SHALL reject invalid identifiers, blank content, or inaccessible records.

#### Scenario: A user updates an owned highlight
- **WHEN** an authenticated user calls `PATCH /api/highlights/:id` for an owned highlight with non-empty content
- **THEN** the system updates and returns the highlight

#### Scenario: A user updates a highlight they do not own
- **WHEN** an authenticated user calls `PATCH /api/highlights/:id` for a missing or unowned highlight
- **THEN** the system returns HTTP `404`

### Requirement: Highlight deletion
The system SHALL allow an authenticated user to delete a highlight owned by their profile.

#### Scenario: A user deletes an owned highlight
- **WHEN** an authenticated user calls `DELETE /api/highlights/:id` for an owned highlight
- **THEN** the system deletes it and returns success

#### Scenario: A user deletes a highlight they do not own
- **WHEN** an authenticated user calls `DELETE /api/highlights/:id` for a missing or unowned highlight
- **THEN** the system returns HTTP `404`
