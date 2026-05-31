# Session Authentication Specification

## Purpose

Define account registration, Redis-backed login sessions, and access checks for protected pages and APIs.

## Requirements

### Requirement: Account registration
The system SHALL accept a username, email, and password when registering an account. It SHALL validate the input, normalize the email, reject an occupied username or email, hash the password, and return the created account without exposing the password hash.

#### Scenario: A visitor submits valid unused account details
- **WHEN** a visitor submits a valid username, email, and password to `POST /api/auth/register`
- **THEN** the system creates the user and returns HTTP `201` with the account identifier, username, email, and creation timestamp

#### Scenario: Registration input is invalid
- **WHEN** a visitor submits registration details that violate the username, email, or password rules
- **THEN** the system returns HTTP `400` with error code `VALIDATION_ERROR`

#### Scenario: Username or email is occupied
- **WHEN** a visitor submits a username or email that already belongs to a user
- **THEN** the system returns HTTP `409` with error code `USER_ALREADY_EXISTS`

### Requirement: Account login
The system SHALL authenticate users by username or email and password. It SHALL reject disabled accounts, temporarily locked accounts, and excessive login attempts.

#### Scenario: A user submits valid credentials
- **WHEN** an active user submits a valid username or email and password to `POST /api/auth/login`
- **THEN** the system creates or rotates the Redis session, resets failure state, and returns the authenticated user payload

#### Scenario: Login attempts exceed the rate limit
- **WHEN** login attempts exceed the Redis-backed limit for an IP address or normalized identifier
- **THEN** the system returns HTTP `429` with error code `TOO_MANY_REQUESTS`

#### Scenario: Repeated password failures lock an account
- **WHEN** a user reaches ten consecutive password failures
- **THEN** the system temporarily locks the account for fifteen minutes

### Requirement: Session cookie
The system SHALL store a session identifier in an HTTP-only, same-site `lax` cookie. It SHALL derive the cookie `Secure` setting from `SESSION_COOKIE_SECURE`, the forwarded protocol, or the request URL protocol.

#### Scenario: Login succeeds over HTTPS
- **WHEN** a login request is identified as HTTPS
- **THEN** the returned session cookie is marked `Secure`

#### Scenario: Login succeeds over HTTP
- **WHEN** a login request is identified as HTTP and `SESSION_COOKIE_SECURE` does not force secure cookies
- **THEN** the returned session cookie is not marked `Secure`

### Requirement: Session inspection and logout
The system SHALL expose the current Redis-backed session and SHALL delete it during logout.

#### Scenario: A request contains a live session cookie
- **WHEN** a client calls `GET /api/auth/me` with a session cookie that exists in Redis
- **THEN** the system returns the authenticated user payload

#### Scenario: A user logs out
- **WHEN** a client calls `POST /api/auth/logout`
- **THEN** the system deletes the Redis session when present and expires the session cookie

### Requirement: Protected route redirect
The system SHALL redirect requests without a session cookie away from protected pages while allowing authentication and health-check endpoints.

#### Scenario: A visitor requests a protected page without a session cookie
- **WHEN** a request without the configured session cookie targets a protected page
- **THEN** the system redirects to `/login` and preserves the original path in the `redirect` query parameter
