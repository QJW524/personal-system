# Health Check Specification

## Purpose

Define the database-aware application health endpoint.

## Requirements

### Requirement: Database health probe
The system SHALL expose `GET /api/health` and SHALL probe PostgreSQL before reporting application health.

#### Scenario: PostgreSQL responds to the probe
- **WHEN** PostgreSQL successfully executes the health query
- **THEN** the endpoint returns HTTP `200` with `status: "ok"`, `database: "connected"`, and an ISO timestamp

#### Scenario: PostgreSQL does not respond to the probe
- **WHEN** the PostgreSQL health query throws an error
- **THEN** the endpoint returns HTTP `503` with `status: "error"`, `database: "disconnected"`, and an ISO timestamp
